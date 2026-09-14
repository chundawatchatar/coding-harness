import type { Tool } from "openai/resources/responses/responses.mjs";

export const READ_FILE_TOOL: Tool = {
  type: "function",
  name: "read_file",
  description: "Read the contents of a file inside the workspace.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Path to the file relative to the workspace root.",
      },
    },
    required: ["filePath"],
    additionalProperties: false,
  },
};

export const WRITE_FILE_TOOL: Tool = {
  type: "function",
  name: "write_file",
  description: "Create or overwrite a file inside the workspace.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Path to the file relative to the workspace root.",
      },
      content: {
        type: "string",
        description: "The complete contents to write to the file.",
      },
    },
    required: ["filePath", "content"],
    additionalProperties: false,
  },
};

export const REPLACE_BLOCK_TOOL: Tool = {
  type: "function",
  name: "replace_block",
  description:
    "Replace one exact block of text in a file. Only the first matching occurrence is replaced.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Path to the file relative to the workspace root.",
      },
      oldContent: {
        type: "string",
        description: "The exact text to find in the file.",
      },
      newContent: {
        type: "string",
        description: "The replacement text.",
      },
    },
    required: ["filePath", "oldContent", "newContent"],
    additionalProperties: false,
  },
};

export const BASH_TOOL: Tool = {
  type: "function",
  name: "bash",
  description:
    "Run a shell command with the workspace as the current working directory.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The shell command to execute.",
      },
    },
    required: ["command"],
    additionalProperties: false,
  },
};

export const TOOLS_DEFINITION: Tool[] = [
  READ_FILE_TOOL,
  WRITE_FILE_TOOL,
  REPLACE_BLOCK_TOOL,
  BASH_TOOL,
];

export type ToolName = "read_file" | "write_file" | "replace_block" | "bash";
