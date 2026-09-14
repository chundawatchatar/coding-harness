import OpenAI from "openai";
import { $ } from "bun";
import { TOOLS_DEFINITION } from "./tool-definItion";
import { getHandler } from "./tool-handler";
import { Tools } from "./tools";

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

const tools = new Tools();

const hasOwnKey = <T extends object>(
  object: T,
  key: PropertyKey,
): key is keyof T => Object.prototype.hasOwnProperty.call(object, key);

const SYSTEM_PROMPT =
  "You are a coding agent and your job is to code and always code";
const userPrompt = prompt("What do you want:");

const bash = (command: string) => {
  const output = $`command`.text();
  return output;
};

if (!userPrompt) {
  process.exit(0);
}

const MODEL = "deepseek-v4-flash";

const response = await client.responses.create({
  model: MODEL,
  input: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ],
  tools: TOOLS_DEFINITION,
});

// Responses API returns output directly
const items = response.output;

for (const item of items) {
  // Normal assistant message
  if (item.type === "message") {
    const textContent = item.content?.find((c) => c.type === "output_text");

    if (textContent) {
      console.log("AI Response:", textContent.text);
    }
  }

  // Model requested a function/tool call
  if (item.type === "function_call") {
    const toolName = item.name;
    const toolArgs = JSON.parse(item.arguments);
    const callId = item.call_id;

    console.log(`AI requested tool "${toolName}" with args:`, toolArgs);

    let toolResult = "";
    const toolHandlers = getHandler(tools);

    if (hasOwnKey(toolHandlers, toolName)) {
      toolResult = await toolHandlers[toolName](toolArgs);
    } else {
      toolResult = `Unknown tool: ${toolName}`;
    }

    // Send the original function call + its result back to the model.
    const finalResponse = await client.responses.create({
      model: MODEL,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },

        // The model's original tool call
        item,

        // The tool's result
        {
          type: "function_call_output",
          call_id: callId,
          output: toolResult,
        },
      ],
    });

    // Responses API returns output directly
    for (const finalItem of finalResponse.output) {
      if (finalItem.type === "message") {
        const textContent = finalItem.content?.find(
          (c) => c.type === "output_text",
        );

        if (textContent) {
          console.log("Final Answer:", textContent.text);
        }
      }
    }
  }
}
