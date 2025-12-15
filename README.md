# Heritage

**Heritage** is an AI-powered educational chatbot designed to guide users through India's rich history, culture, and traditions. Powered by the **Groq API (Llama 3)** and built with **Next.js 16**, it offers instant, accurate, and context-aware historical insights in a conversational interface.

## Features

-   **AI Historical Guide:** Integrated with **Groq (Llama-3.1-8b)** to provide instant, accurate answers about Indian empires, monuments, and Vedic history.
-   **Custom Stateless Authentication:** A robust, secure authentication system built from scratch using **JWT (jose)** and **HTTP-only cookies**—no external auth providers.
-   **Secure Middleware:** Edge-compatible middleware protecting sensitive routes (`/chat`, `/settings`) with optimized session verification.
-   **User Management:** Full profile management allowing users to update display names and passwords securely.
-   **High Performance:** Built on **Next.js App Router** and **Server Actions** for zero-client-bundle data fetching.
-   **Modern UI/UX:** Responsive, glassmorphic design with animated backgrounds using **Tailwind CSS**.

## Tech Stack

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Database:** MongoDB (via Mongoose)
-   **AI Engine:** Groq SDK (Llama 3.1-8b-instant)
-   **Authentication:** Custom JWT (`jose`), `bcryptjs`, Secure Cookies
-   **Styling:** Tailwind CSS
-   **Deployment:** Vercel

## Environment Variables

To run this project, you need to add the following environment variables to your `.env` file locally or in your Vercel project settings:

```env
# MongoDB Connection String (Atlas)
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/heritage"

# A long random string for signing JWTs
SESSION_SECRET="your_super_secret_complex_key_here"

# Groq API Key for AI responses
GROQ_API_KEY="gsk_..."
````

## Getting Started Locally

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/yourusername/heritage.git](https://github.com/yourusername/heritage.git)
    cd heritage
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add the variables listed above.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit `http://localhost:3000` in your browser.

## Project Structure

```bash
src/
├── app/
│   ├── actions/      # Server Actions (Auth, Chat, User updates)
│   ├── chat/         # Protected Chat Interface
│   ├── login/        # Custom Login Page
│   ├── register/     # Custom Registration Page
│   └── settings/     # User Profile Settings
├── components/       # Reusable UI components (UserMenu, etc.)
├── lib/
│   ├── db.ts         # Singleton MongoDB Connection
│   └── session.ts    # JWT Session Management
├── middleware.ts     # Edge Middleware for Route Protection
└── models/           # Mongoose Schemas (User)
```

## Security Highlights

  - **No LocalStorage:** Tokens are stored exclusively in **HTTP-Only, Secure cookies** to prevent XSS attacks.
  - **Edge Middleware:** Authentication checks happen at the edge before the page even renders.
  - **Server-Side Validation:** All inputs are validated strictly on the server using Native checks before hitting the database.


## License

This project is licensed under the MIT License.