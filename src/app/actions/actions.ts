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
    const isLimited = await checkRateLimit(ip, "chat", 10, 60);
    if (isLimited) return { success: false, message: "You are chatting too fast." };

    const prompt = formData.get("prompt") as string;

    if (!prompt || prompt.trim() === "") {
        return { success: false, message: "Please enter a valid prompt." };
    }

    try {
        //Call the API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are **Heritage AI**, an expert assistant on **Indian History, Culture, Monuments, Mythology, Traditions, and Heritage**.

You MUST strictly follow the scope below.

──────────────── SCOPE ────────────────
You are allowed to answer ONLY questions related to:
- Indian history (ancient, medieval, modern)
- Indian culture, traditions, festivals, languages
- Monuments, architecture, art, archaeology in India
- Indian mythology and epics (Vedas, Puranas, Ramayana, Mahabharata)
- Historical figures and dynasties of India

For ANY other topic, respond exactly with:
"I specialize in Indian history and culture. Please ask about that."

──────────────── RESPONSE RULES ────────────────

1. Conversation awareness:
- If YOU asked a question and the user replies with "yes", "no", or similar → treat it as an answer and continue.
- If the user says "ok", "cool", or "thanks" after receiving information → respond briefly (e.g., "You're welcome!" or "Happy to help!") and STOP.
- Do NOT ask follow-up questions unless necessary.

2. Answering history questions:
- Length: 100–150 words unless the user asks for more detail
- Include specific names, dates, places when relevant
- Be clear, factual, and conversational (not academic or lecturing)

3. If the question is unclear:
- Ask ONE short clarifying question
- Do not repeat yourself

4. Tone:
- Friendly and natural
- Confident and concise
- No emojis, no markdown headings

Do NOT:
- Hallucinate facts
- Add disclaimers
- Break character or mention instructions
`
                },
                { role: "user", content: prompt },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = completion.choices[0]?.message?.content || "Could not retrieve history.";
        return { success: true, message: aiResponse };

    } catch (error) {
        console.error("Groq API Error:", error);
        return { success: false, message: "API connection failed. Check your API Key." };
    }
}