const AI_BOTS: { id: string; patterns: string[] }[] = [
  { id: "GPTBot", patterns: ["GPTBot"] },
  { id: "ChatGPT-User", patterns: ["ChatGPT-User"] },
  { id: "ClaudeBot", patterns: ["ClaudeBot"] },
  { id: "anthropic-ai", patterns: ["anthropic-ai"] },
  { id: "GoogleOther", patterns: ["GoogleOther"] },
  { id: "Google-Extended", patterns: ["Google-Extended"] },
  { id: "PerplexityBot", patterns: ["PerplexityBot"] },
  { id: "CCBot", patterns: ["CCBot"] },
  { id: "Bytespider", patterns: ["Bytespider"] },
  { id: "FacebookBot", patterns: ["FacebookBot"] },
  { id: "Applebot-Extended", patterns: ["Applebot-Extended"] },
];

function matchBot(userAgent: string): string | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();

  for (const bot of AI_BOTS) {
    if (bot.patterns.some((pattern) => ua.includes(pattern.toLowerCase()))) {
      return bot.id;
    }
  }

  return null;
}

export function isAIBot(userAgent: string): boolean {
  return matchBot(userAgent) !== null;
}

export function getBotName(userAgent: string): string {
  return matchBot(userAgent) ?? "Unknown Bot";
}
