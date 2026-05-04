"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setToken(null);

    const res = await fetch("/api/me/token", { method: "POST" });
    setGenerating(false);

    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setError("Failed to generate token");
      return;
    }

    const data = await res.json();
    setToken(data.token);
  }

  async function handleCopy() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold mb-6">Settings</h1>

      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 space-y-4">
        <div>
          <h2 className="font-semibold mb-1">API Token</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Use this token to submit entries from agents or the MCP server. Set it as{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">OPENREEF_TOKEN</code>{" "}
            in your environment. Each time you generate a new token, previous tokens remain valid.
          </p>
        </div>

        {token && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 break-all font-mono select-all">
                {token}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 text-xs px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Copy it now — this token will not be shown again.
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {generating ? "Generating…" : "Generate new token"}
        </button>
      </div>
    </div>
  );
}
