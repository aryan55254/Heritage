export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-red-950">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Decorative mandala patterns */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute top-10 right-20 w-48 h-48 animate-spin"
          style={{ animationDuration: "60s" }}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
        <svg
          className="absolute bottom-20 left-20 w-64 h-64 animate-spin"
          style={{ animationDuration: "90s", animationDirection: "reverse" }}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Decorative top accent */}
        <div className="mb-8 flex items-center gap-3 opacity-80">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          <svg
            className="w-6 h-6 text-amber-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        </div>

        {/* Main heading with gradient */}
        <h1
          className="text-7xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent animate-pulse"
          style={{ animationDuration: "3s" }}
        >
          Heritage
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl mb-4 text-amber-100 text-center max-w-2xl font-light tracking-wide">
          Your AI-Powered Chatbot for Indian History
        </p>

        <p className="text-sm md:text-base mb-8 text-amber-200/70 text-center max-w-xl px-4">
          Ask questions, explore ancient wisdom, and discover India's rich
          heritage through conversation
        </p>

        {/* Chat preview mockup */}
        <div className="mb-12 bg-gradient-to-br from-amber-950/40 to-orange-950/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <div className="bg-amber-900/30 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-amber-50">
                Tell me about the Maurya Empire
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
              </div>
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-amber-50">
                The Maurya Empire (322-185 BCE) was one of the largest empires
                in ancient India...
                <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button with glow effect */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
          <a
            href="/register"
            className="relative block px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-lg font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-2xl transform group-hover:scale-105"
          >
            Start Your Journey
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>

        {/* Login link */}
        <a
          href="/login"
          className="text-sm text-amber-200/80 hover:text-amber-100 transition-colors underline decoration-amber-400/50 hover:decoration-amber-400 underline-offset-4"
        >
          Already have an account? Sign in
        </a>

        {/* Features strip */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-sm text-amber-200/60">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              />
            </svg>
            <span>Conversational AI</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span>Historical Knowledge</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              />
            </svg>
            <span>Instant Answers</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
    </div>
  );
}
