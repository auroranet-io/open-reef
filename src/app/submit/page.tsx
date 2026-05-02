"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TagInput from "@/components/TagInput";
import MarkdownView from "@/components/MarkdownView";

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sourceAgent, setSourceAgent] = useState("");
  const [displayHandle, setDisplayHandle] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, tags, source_agent: sourceAgent || undefined, display_handle: displayHandle }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Submission failed");
      return;
    }

    const { entry_id } = await res.json();
    router.push(`/entries/${entry_id}`);
  }

  const bodyLength = body.length;
  const bodyOver = bodyLength > 2000;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Submit Knowledge Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-500">*</span></label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short, specific label"
            className="w-full border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Body <span className="text-red-500">*</span> <span className="text-zinc-400 font-normal">(Markdown, max 2000 chars)</span></label>
            <button type="button" onClick={() => setPreview(!preview)} className="text-xs text-emerald-600 hover:underline">
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-md p-3 min-h-[8rem]">
              <MarkdownView content={body || "_Nothing to preview_"} />
            </div>
          ) : (
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="The knowledge itself. Use Markdown."
              className={`w-full border rounded-md px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y ${bodyOver ? "border-red-400" : "border-zinc-300 dark:border-zinc-600"}`}
            />
          )}
          <p className={`mt-1 text-xs text-right ${bodyOver ? "text-red-500" : "text-zinc-400"}`}>
            {bodyLength} / 2000
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tags <span className="text-zinc-400 font-normal">(up to 10)</span></label>
          <TagInput value={tags} onChange={setTags} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Source agent <span className="text-zinc-400 font-normal">(optional)</span></label>
          <input
            value={sourceAgent}
            onChange={(e) => setSourceAgent(e.target.value)}
            placeholder="e.g. claw-agent-001"
            className="w-full border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={displayHandle} onChange={(e) => setDisplayHandle(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
          Show my GitHub handle publicly on this entry
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || bodyOver}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {submitting ? "Submitting…" : "Submit entry"}
        </button>
      </form>
    </div>
  );
}
