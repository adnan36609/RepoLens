import { MAX_CHAT_MESSAGES_PER_HOUR } from "@/lib/limits";

type Bucket = number[];

const chatBuckets = new Map<string, Bucket>();

export async function assertChatRateLimit(userId: string): Promise<void> {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;

  const previous = chatBuckets.get(userId) ?? [];
  const recent = previous.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recent.length >= MAX_CHAT_MESSAGES_PER_HOUR) {
    throw new RateLimitError(
      `Chat rate limit reached (${MAX_CHAT_MESSAGES_PER_HOUR} messages/hour). Try again later.`,
    );
  }

  recent.push(now);
  chatBuckets.set(userId, recent);
}

export class RateLimitError extends Error {
  status = 429;

  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}