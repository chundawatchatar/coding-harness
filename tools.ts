import { $ } from "bun";
import { join, resolve, relative } from "path";

export class Tools {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  private safePath(relativePath: string) {
    const absolutePath = resolve(join(this.workspaceRoot, relativePath));
    if (!absolutePath.startsWith(this.workspaceRoot)) {
      throw new Error("Access denied");
    }
    return absolutePath;
  }

  async readFile(filePath: string): Promise<string> {
    const target = this.safePath(filePath);
    const file = Bun.file(target);
    if (!file.exists()) {
      throw new Error("file not found");
    }
    return file.text();
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const target = this.safePath(filePath);

    await Bun.write(target, content);
  }

  async replaceBlock(
    filePath: string,
    oldContent: string,
    newContent: string,
  ): Promise<void> {
    const target = this.safePath(filePath);
    const file = Bun.file(target);

    if (!file.exists()) {
      throw new Error("file not found");
    }
    const currentFileContent = await file.text();
    await Bun.write(target, currentFileContent.replace(oldContent, newContent));
  }

  async bash(command: string): Promise<string> {
    const result = await $`${{ raw: command }}`.text();
    return result;
  }
}
