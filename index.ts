import { $ } from "bun";
import { loop } from "./ai-loop";

const SYSTEM_PROMPT =
  "You are a coding agent and your job is to code and always code";
const userPrompt = prompt("What do you want:");

if (!userPrompt) {
  process.exit(0);
}

loop([
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "user",
    content: userPrompt,
  },
]);
