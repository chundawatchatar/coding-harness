import { Tools } from "./tools";

export const getHandler = (tools: Tools) => ({
  read_file: async (args: any): Promise<string> => {
    return tools.readFile(args.filePath);
  },
  write_file: async (args: any): Promise<string> => {
    await tools.writeFile(args.filePath, args.content);
    return `Wrote file: ${args.filePath}`;
  },
  replace_block: async (args: any): Promise<string> => {
    await tools.replaceBlock(args.filePath, args.oldContent, args.newContent);
    return `Updated file: ${args.filePath}`;
  },
  bash: async (args: any): Promise<string> => {
    return tools.bash(args.command);
  },
});
