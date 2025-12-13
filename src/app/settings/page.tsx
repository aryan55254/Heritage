"use client";

import { useState, useEffect } from "react";
import { updateUserDetails, getUserDetails } from "../actions/user";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getUserDetails().then((data) => {
      if (data) setUser(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserDetails(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated!" });
      const newName = formData.get("name") as string;
      if (user) setUser({ ...user, name: newName });
    } else {
      setMessage({ type: "error", text: result.error || "Error updating." });
    }
    setIsSaving(false);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-amber-950 flex items-center justify-center text-amber-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        {/* Glass Card */}
        <div className="bg-gradient-to-br from-amber-950/90 to-orange-950/90 backdrop-blur-xl border border-amber-500/30 p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-amber-100">Settings</h1>
            <button
              onClick={() => router.back()}
              className="text-amber-300 hover:text-amber-100 text-sm font-medium transition-colors"
            >
              ← Back to Chat
            </button>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 text-sm ${
                message.type === "success"
                  ? "bg-green-900/50 text-green-200 border-green-500/30"
                  : "bg-red-900/50 text-red-200 border-red-500/30"
              } border`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-Only Email */}
            <div>
              <label className="block text-amber-200/60 text-xs uppercase font-semibold mb-2">
                Email (Cannot be changed)
              </label>
              <input
                type="text"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 bg-amber-950/30 border border-amber-500/10 rounded-xl text-amber-200/50 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-amber-200 text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={user?.name}
                required
                className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-amber-200 text-sm font-medium mb-2">
                New Password (Optional)
              </label>
              <input
                name="newPassword"
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
