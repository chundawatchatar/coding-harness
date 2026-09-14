import type { ToolName } from "./tool-definItion";
import { Tools } from "./tools";

export const getHandler = (tools: Tools) => ({
  read_file: (args: any) => {
    return tools.readFile(args.filePath);
  },
  write_file: (args: any) => {
    tools.writeFile(args.filePath, args.content);
  },
  replace_block: (args: any) => {
    tools.replaceBlock(args.filePath, args.oldContent, args.newContent);
  },
  bash: (args: any) => {
    return tools.bash(args.command);
  },
});
