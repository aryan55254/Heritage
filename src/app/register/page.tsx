"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleregister } from "../actions/actions";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      const result = await handleregister(formData);

      if (result.success) {
        router.push("/chat");
        router.refresh();
      } else {
        setError(result.error || "Registration failed");
        setIsLoading(false); // <--- THIS STOPS THE SPINNER
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-red-950">
      {/* ... (Keep your background divs/svgs here) ... */}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* ... (Keep your Back to Home link) ... */}

        <div className="w-full max-w-md">
          {/* ... (Keep your card container divs) ... */}
          <div className="relative bg-gradient-to-br from-amber-950/90 to-orange-950/90 backdrop-blur-xl border border-amber-500/30 p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent mb-3">
                Heritage
              </h2>
              <p className="text-amber-200/70 text-sm">Create your account</p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm font-medium">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME INPUT */}
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? "Checking..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-amber-200/60 text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-amber-300 hover:text-amber-200 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
