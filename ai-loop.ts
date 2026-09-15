import OpenAI from "openai";
import { TOOLS_DEFINITION } from "./tool-definItion";
import type {
  ResponseFunctionToolCall,
  ResponseInput,
  ResponseInputItem,
} from "openai/resources/responses/responses.mjs";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems.mjs";
import { getHandler } from "./tool-handler";
import { Tools } from "./tools";

const MODEL = "deepseek-v4-flash";
const MAX_ATTEMPT = 50;
const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});
const tools = new Tools();

const hasOwnKey = <T extends object>(
  object: T,
  key: PropertyKey,
): key is keyof T => Object.prototype.hasOwnProperty.call(object, key);

export const loop = async (messages: ResponseInput) => {
  for (let i = 0; i < MAX_ATTEMPT; i++) {
    console.log({ loop: i });
    const response = await client.responses.create({
      model: MODEL,
      input: messages,
      tools: TOOLS_DEFINITION,
    });

    if (response.status !== "completed") {
      throw new Error(
        `Model response failed: ${JSON.stringify(response.error ?? response.incomplete_details)}`,
      );
    }

    const toolCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    const responseMessageItems = response.output.filter(
      (item) => item.type === "message",
    );

    for (const messageItem of responseMessageItems) {
      const textContent = messageItem.content?.find(
        (c) => c.type === "output_text",
      );

      if (textContent) {
        console.log("AI Response:", textContent.text);
      }
    }

    if (toolCalls.length === 0) {
      break;
    }
    messages.push(...toResponseInputItems(response.output));

    const toolResults = await handleToolCalls(toolCalls);
    messages.push(...toolResults);
  }
};

const handleToolCalls = async (
  items: ResponseFunctionToolCall[],
): Promise<ResponseInputItem.FunctionCallOutput[]> => {
  const results: ResponseInputItem.FunctionCallOutput[] = [];
  for (const item of items) {
    const toolName = item.name;
    const toolArgs = JSON.parse(item.arguments);

    console.log(`AI requested tool "${toolName}" with args:`, toolArgs);

    let toolResult = "";
    const toolHandlers = getHandler(tools);

    if (hasOwnKey(toolHandlers, toolName)) {
      toolResult = await toolHandlers[toolName](toolArgs);
    } else {
      toolResult = `Unknown tool: ${toolName}`;
    }

    results.push({
      type: "function_call_output",
      call_id: item.call_id,
      output:
        typeof toolResult === "string"
          ? toolResult
          : JSON.stringify(toolResult),
    });
  }
  return results;
};
