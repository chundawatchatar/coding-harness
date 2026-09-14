import { describe, expect, test } from "bun:test";
import { Tools } from "./tools";

describe("tools", () => {
  test("bash", async () => {
    expect.hasAssertions();
    const tools = new Tools();
    const res = await tools.bash("pwd");
    console.log(res);
    expect(res).toContain("coding-harness");
  });
});
