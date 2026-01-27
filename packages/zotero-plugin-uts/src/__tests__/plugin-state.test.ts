import { beforeEach, describe, expect, it } from "vitest";
import { pluginState } from "@/core/plugin-state";

describe("PluginState", () => {
  beforeEach(() => {
    pluginState.reset();
  });

  it("should not be initialized by default", () => {
    expect(pluginState.isInitialized()).toBe(false);
  });

  it("should return empty strings when not initialized", () => {
    expect(pluginState.rootURI).toBe("");
    expect(pluginState.pluginID).toBe("");
    expect(pluginState.version).toBe("");
  });

  it("should store context after initialization", () => {
    const context = {
      id: "test-plugin@example.com",
      version: "0.1.0",
      rootURI: "chrome://test/",
    };

    pluginState.initialize(context);

    expect(pluginState.isInitialized()).toBe(true);
    expect(pluginState.pluginID).toBe("test-plugin@example.com");
    expect(pluginState.version).toBe("0.1.0");
    expect(pluginState.rootURI).toBe("chrome://test/");
  });

  it("should reset to initial state", () => {
    pluginState.initialize({
      id: "test@example.com",
      version: "0.1.0",
      rootURI: "chrome://test/",
    });

    pluginState.reset();

    expect(pluginState.isInitialized()).toBe(false);
    expect(pluginState.rootURI).toBe("");
  });
});
