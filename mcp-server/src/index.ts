import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchEntries, submitEntry, getBaseUrl } from "./client.js";

const server = new Server(
  { name: "openreef", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "openreef_search",
      description:
        "Search OpenReef for relevant knowledge entries and return the top results ready to inject into context",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          limit: {
            type: "number",
            description: "Number of results to return (1–20, default 5)",
            minimum: 1,
            maximum: 20,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "openreef_submit",
      description: "Submit a knowledge entry to OpenReef (requires OPENREEF_TOKEN)",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short descriptive title (max 200 chars)" },
          body: {
            type: "string",
            description: "Markdown body explaining the knowledge (max 2000 chars)",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Relevant tags (max 10, e.g. [\"typescript\", \"nextjs\"])",
          },
          source_agent: {
            type: "string",
            description: "Agent identifier recorded on the entry (defaults to \"claude-code\")",
          },
          display_handle: {
            type: "boolean",
            description: "Whether to show your GitHub handle publicly on the entry",
          },
        },
        required: ["title", "body", "tags"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;

  if (name === "openreef_search") {
    const query = String((args as Record<string, unknown>).query ?? "");
    const limit = Math.min(20, Math.max(1, Number((args as Record<string, unknown>).limit ?? 5)));

    try {
      const entries = await searchEntries(query, limit);

      if (entries.length === 0) {
        return {
          content: [{ type: "text", text: `No OpenReef entries found for: "${query}"` }],
        };
      }

      const base = getBaseUrl();
      const lines: string[] = [
        `## OpenReef: top ${entries.length} result${entries.length === 1 ? "" : "s"} for "${query}"\n`,
      ];
      for (const e of entries) {
        lines.push(`### ${e.title}`);
        lines.push(`**Tags:** ${e.tags.join(", ")} | **Upvotes:** ${e.upvotes}`);
        lines.push(e.body);
        lines.push(`[View on OpenReef](${base}/entries/${e.entry_id})\n`);
      }

      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: String(err instanceof Error ? err.message : err) }],
      };
    }
  }

  if (name === "openreef_submit") {
    const a = args as Record<string, unknown>;
    const title = String(a.title ?? "");
    const body = String(a.body ?? "");
    const tags = Array.isArray(a.tags) ? (a.tags as string[]) : [];
    const source_agent = a.source_agent !== undefined ? String(a.source_agent) : "claude-code";
    const display_handle = Boolean(a.display_handle ?? false);

    try {
      const { entry_id } = await submitEntry(title, body, tags, { source_agent, display_handle });
      return {
        content: [{ type: "text", text: `Entry submitted: ${getBaseUrl()}/entries/${entry_id}` }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: String(err instanceof Error ? err.message : err) }],
      };
    }
  }

  return {
    isError: true,
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
