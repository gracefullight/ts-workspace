import type { MozillaServices, PluginContext, ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;
declare const Services: MozillaServices;

interface ZoteroPluginUTSModule {
  startup: (context: PluginContext) => Promise<void>;
  shutdown: () => void;
  onWindowLoad: (window: Window) => void;
  onWindowUnload: (window: Window) => void;
}

declare const ZoteroPluginUTS: ZoteroPluginUTSModule | undefined;

// biome-ignore lint/suspicious/noShadowRestrictedNames: Zotero plugin bootstrap requires globalThis assignments
declare const globalThis: {
  install: () => void;
  startup: (context: PluginContext) => Promise<void>;
  onMainWindowLoad: (params: { window: Window }) => void;
  onMainWindowUnload: (params: { window: Window }) => void;
  shutdown: () => void;
  uninstall: () => void;
};

function log(msg: string): void {
  Zotero.debug(`UTS Citation: ${msg}`);
}

globalThis.install = () => {
  log("Installed");
};

globalThis.startup = async (context: PluginContext) => {
  log("Starting");
  Services.scriptloader.loadSubScript(`${context.rootURI}index.global.js`);

  if (typeof ZoteroPluginUTS !== "undefined") {
    (Zotero as unknown as Record<string, unknown>).ZoteroPluginUTS = ZoteroPluginUTS;
    await ZoteroPluginUTS.startup(context);
  }
};

globalThis.onMainWindowLoad = ({ window }: { window: Window }) => {
  if (typeof ZoteroPluginUTS !== "undefined") {
    ZoteroPluginUTS.onWindowLoad(window);
  }
};

globalThis.onMainWindowUnload = ({ window }: { window: Window }) => {
  if (typeof ZoteroPluginUTS !== "undefined") {
    ZoteroPluginUTS.onWindowUnload(window);
  }
};

globalThis.shutdown = () => {
  log("Shutting down");
  if (typeof ZoteroPluginUTS !== "undefined") {
    ZoteroPluginUTS.shutdown();
  }
};

globalThis.uninstall = () => {
  log("Uninstalled");
};
