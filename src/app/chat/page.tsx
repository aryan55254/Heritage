"use client";

import React, { useState, useRef, useEffect } from "react";
import { handlechat } from "../actions/actions";
import { getUserDetails } from "../actions/user";
import UserMenu from "../../components/UserMenu";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user details on mount
  useEffect(() => {
    getUserDetails().then((data) => {
      if (data) setUser(data);
    });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt || isLoading) return;

    setChatHistory((prev) => [...prev, { role: "user", content: userPrompt }]);
    setIsLoading(true);
    setPrompt("");

    const formData = new FormData();
    formData.append("prompt", userPrompt);

    const result = await handlechat(formData);

    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: result.message },
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-amber-900 via-orange-900 to-red-950 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
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
      <div className="absolute inset-0 opacity-5 pointer-events-none">
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
      </div>

      {/* Header - Fixed at top */}
      <div className="relative z-20 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/60 to-orange-950/60 backdrop-blur-md shadow-lg flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  Heritage AI
                </h1>
                <p className="text-[10px] md:text-xs text-amber-200/60 hidden sm:block">
                  Your Guide to Indian History
                </p>
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            {user && <UserMenu initialName={user.name} email={user.email} />}
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable middle section */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-transparent"
      >
        <div className="max-w-5xl mx-auto w-full p-4 pb-24 md:p-8 md:pb-8">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-6 animate-pulse">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-amber-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 mb-2">
                Welcome, {user?.name.split(" ")[0] || "Traveler"}
              </h2>
              <p className="text-sm md:text-base text-amber-200/60 mb-8 max-w-md mx-auto">
                Ask me anything about Indian history, culture, monuments,
                empires, and traditions.
              </p>

              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "Tell me about the Maurya Empire",
                  "What is the history of the Taj Mahal?",
                  "Explain the Vedic period",
                  "Who was Ashoka the Great?",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(suggestion)}
                    className="p-3 md:p-4 bg-gradient-to-br from-amber-950/40 to-orange-950/40 backdrop-blur-sm border border-amber-500/20 rounded-xl text-amber-100 text-xs md:text-sm text-left hover:border-amber-400/40 hover:from-amber-950/60 hover:to-orange-950/60 transition-all active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 items-start ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.role === "user" ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                        <svg
                          className="w-4 h-4 text-amber-950"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="bg-amber-900/40 border border-amber-500/20 rounded-2xl rounded-tr-none px-4 py-2.5 md:px-5 md:py-3 text-amber-50 max-w-[85%] md:max-w-2xl text-sm md:text-base">
                        {msg.content}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                        </svg>
                      </div>
                      <div className="flex-grow bg-gradient-to-br from-amber-950/60 to-orange-950/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl rounded-tl-none px-4 py-3 md:px-5 md:py-4 text-amber-50 shadow-2xl max-w-[90%] md:max-w-2xl">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                          {msg.content}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl rounded-tl-none px-4 py-3 text-amber-50 shadow-2xl">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input Form - Fixed at bottom */}
      <div className="relative z-20 border-t border-amber-500/20 bg-gradient-to-r from-amber-950/80 to-orange-950/80 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-5xl mx-auto w-full p-3 md:p-6 pb-6 md:pb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-gradient-to-br from-amber-950/90 to-orange-950/90 backdrop-blur-md border border-amber-500/30 p-2 md:p-3 rounded-2xl shadow-2xl">
              <div className="flex gap-2 md:gap-3 items-end">
                <textarea
                  name="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Ask about empires, traditions..."
                  rows={1}
                  className="flex-grow px-4 py-3 md:py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 placeholder-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 disabled:opacity-50 transition-all resize-none min-h-[48px] max-h-[120px] text-sm md:text-base scrollbar-hide"
                  style={{ height: "auto" }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || prompt.trim() === ""}
                  className="flex-shrink-0 h-[48px] px-4 md:px-6 cursor-pointer bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 disabled:from-amber-800 disabled:to-orange-800 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
    </div>
  );
}
