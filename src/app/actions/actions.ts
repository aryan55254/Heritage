'use server'

export async function handleregister(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, error: "All fields are required." };
    }

    try {
        //register logic with prisma

    } catch (e) {
        console.error("Registration Error:", e);
        return { success: false, error: "An unexpected error occurred during registration." };
    }
}

export async function handlechat(formData: FormData) {
    const prompt = formData.get("prompt") as string;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Dummy responses based on keywords
    const responses: { [key: string]: string } = {
        "maurya": "The Maurya Empire (322-185 BCE) was one of the largest and most powerful empires in ancient India. Founded by Chandragupta Maurya, it reached its peak under Emperor Ashoka the Great, who ruled from 268 to 232 BCE. The empire stretched across most of the Indian subcontinent and parts of present-day Afghanistan and Iran.\n\nAshoka is particularly famous for embracing Buddhism after the bloody Kalinga War and promoting peace, non-violence, and dharma throughout his realm. His edicts, carved on rocks and pillars across the empire, are among the earliest preserved historical records in India.",

        "taj mahal": "The Taj Mahal is an iconic ivory-white marble mausoleum located in Agra, Uttar Pradesh, India. Built between 1632 and 1653 by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, it is considered one of the finest examples of Mughal architecture.\n\nThe monument combines elements from Persian, Islamic, and Indian architectural styles. It took approximately 20,000 artisans and craftsmen to complete. The complex includes a main gateway, gardens, mosque, guest house, and the mausoleum itself. In 1983, the Taj Mahal was designated a UNESCO World Heritage Site.",

        "vedic": "The Vedic period (c. 1500-500 BCE) represents a crucial era in ancient Indian history. During this time, the Vedas—the oldest sacred texts of Hinduism—were composed. The period is divided into the Early Vedic Period (Rigvedic Period, c. 1500-1000 BCE) and the Later Vedic Period (c. 1000-500 BCE).\n\nSociety was primarily pastoral and agricultural, with a gradual transition toward more complex social structures. The caste system began to develop, and various rituals and philosophical concepts that form the foundation of Hinduism emerged. Major cities like Hastinapur and Kaushambi grew during this period.",

        "ashoka": "Ashoka the Great (reigned c. 268-232 BCE) was the third emperor of the Maurya Dynasty and one of India's greatest rulers. Initially known for his military conquests, particularly the brutal Kalinga War, Ashoka underwent a profound transformation and converted to Buddhism.\n\nAfter his conversion, he dedicated his life to spreading Buddhist principles of non-violence, tolerance, and compassion. He erected numerous pillars and rock edicts across his empire, inscribed with his dhamma (moral law). His symbol, the Lion Capital of Ashoka, is now India's national emblem. Ashoka's reign is considered a golden age of Indian history.",

        "indus valley": "The Indus Valley Civilization (c. 3300-1300 BCE), also known as the Harappan Civilization, was one of the world's earliest urban civilizations, alongside Mesopotamia and Ancient Egypt. It flourished in the northwestern regions of South Asia, primarily in present-day Pakistan and northwest India.\n\nMajor cities included Harappa and Mohenjo-daro, which featured advanced urban planning with grid layouts, sophisticated drainage systems, and standardized brick sizes. The civilization had a writing system that remains undeciphered, engaged in extensive trade, and showed remarkable achievements in metallurgy, pottery, and bead-making. The reasons for its decline around 1300 BCE remain debated among historians.",

        "mughal": "The Mughal Empire (1526-1857) was one of the largest and longest-lasting empires in Indian history. Founded by Babur after his victory at the Battle of Panipat in 1526, the empire reached its peak under Akbar the Great (1556-1605) and his successors Jahangir, Shah Jahan, and Aurangzeb.\n\nThe Mughals made significant contributions to Indian art, architecture, literature, and cuisine. They built magnificent monuments like the Taj Mahal, Red Fort, and Fatehpur Sikri. The empire facilitated cultural synthesis between Persian, Islamic, and Indian traditions. Its decline began in the 18th century, leading to British colonial rule.",
    };

    // Find matching response based on keywords
    const lowerPrompt = prompt.toLowerCase();
    let response = "I'm Heritage AI, your guide to Indian history. I can tell you about ancient empires like the Maurya and Mughal dynasties, iconic monuments like the Taj Mahal, important periods like the Vedic age, and influential rulers like Ashoka the Great. What would you like to know?";

    for (const [keyword, text] of Object.entries(responses)) {
        if (lowerPrompt.includes(keyword)) {
            response = text;
            break;
        }
    }

    return {
        success: true,
        message: response,
    };
}