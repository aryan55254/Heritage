"use server";

import connectDB from "../../lib/db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "../../lib/session";
import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

//--initiaze redis ----
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

//rate-limiter
async function checkRateLimit(identifier: string, action: string, limit: number, windowSeconds: number) {

    const distinctIdentifier = identifier.split(",")[0].trim();

    const key = `ratelimit:${action}:${distinctIdentifier}`;
    const initialized = await redis.set(key, 1, { ex: windowSeconds, nx: true });

    if (initialized) {
        return 1 > limit;
    }
    const count = await redis.incr(key);
    return count > limit;
}

// --- REGISTER ---
export async function handleregister(formData: FormData) {
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const isLimited = await checkRateLimit(ip, "register", 3, 3600);
    if (isLimited) return { success: false, error: "Too many accounts created. Try again later." };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { success: false, error: "All fields are required." };
    }

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) return { success: false, error: "Email exists." };

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        await createSession(newUser._id.toString());
        return { success: true };
    } catch (err) {
        return { success: false, error: "Registration failed." };
    }
}

// --- LOGIN ---
export async function handlelogin(formData: FormData) {

    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const isLimited = await checkRateLimit(ip, "login", 5, 600);
    if (isLimited) return { success: false, error: "Too many login attempts. Wait 10 mins." };

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await connectDB();
        const user = await User.findOne({ email });

        if (!user) return { success: false, error: "Invalid credentials." };

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return { success: false, error: "Invalid credentials." };

        await createSession(user._id.toString());
        return { success: true };
    } catch (err) {
        return { success: false, error: "Login failed." };
    }
}

// --- LOGOUT ---
export async function handlelogout() {
    await deleteSession();
    return { success: true };
}

// --- CHAT (AI) ---
export async function handlechat(formData: FormData) {
    const ip = (await headers()).get("x-forwarded-for") || "unknown";

    // 1. Rate Limiting
    const isLimited = await checkRateLimit(ip, "chat", 10, 60);
    if (isLimited) {
        return { success: false, message: "You are chatting too fast." };
    }

    const prompt = formData.get("prompt") as string;
    if (!prompt || prompt.trim() === "") {
        return { success: false, message: "Please enter a valid prompt." };
    }

    // 2. Define the Redis Key for this IP's history
    const historyKey = `chat:history:${ip}`;

    try {
        // 3. Fetch History (Sliding Window)
        // We store the history as a JSON string of messages
        let history = await redis.get<any[]>(historyKey) || [];

        // 4. Define System Prompt
        const systemMessage = {
            role: "system",
            content: `You are **Heritage AI**, an expert on Indian History, Culture, Monuments, Mythology, Traditions, and Heritage.

──────────────── SCOPE ────────────────
You may answer ONLY questions related to:
- Indian history (ancient, medieval, modern)
- Culture, traditions, festivals, languages of India
- Indian monuments, architecture, archaeology
- Indian mythology and epics
- Historical figures and dynasties of India

For ANY other topic, respond exactly with:
"I specialize in Indian history and culture. Please ask about that."

──────────────── STRICT BEHAVIOR RULES ────────────────
1. NO QUESTIONS RULE (VERY IMPORTANT):
- You must NEVER ask the user any questions.
- Do NOT ask follow-ups.

2. Acknowledgments:
- If the user says "ok", "thanks", etc., respond with a brief acknowledgment and END.

3. Answering valid questions:
- Length: 100–150 words unless asked for detail
- Be factual, calm, and conversational
- No markdown, no emojis`
        };

        // 5. Construct the Payload
        // We prepend the system message to the history, then add the new user prompt
        // Note: We keep the system message distinct so it's always at index 0 in the request
        const messagesToContext = [
            systemMessage,
            ...history,
            { role: "user", content: prompt }
        ];

        // 6. Call Groq
        const completion = await groq.chat.completions.create({
            messages: messagesToContext,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024
        });

        const aiResponse = completion.choices[0]?.message?.content || "Could not retrieve history.";

        // 7. Update History in Redis
        // We push the new interaction: User Prompt + AI Response
        history.push({ role: "user", content: prompt });
        history.push({ role: "assistant", content: aiResponse });

        // Optimize: Keep only the last 6 messages (3 turns) to save tokens/costs
        // This creates the "Sliding Window" effect
        if (history.length > 6) {
            history = history.slice(history.length - 6);
        }

        // Save back to Redis with a 10-minute expiry (TTL)
        await redis.set(historyKey, history, { ex: 600 });

        return { success: true, message: aiResponse };

    } catch (error) {
        console.error("Groq API Error:", error);
        return {
            success: false,
            message: "API connection failed. Check your API key."
        };
    }
}