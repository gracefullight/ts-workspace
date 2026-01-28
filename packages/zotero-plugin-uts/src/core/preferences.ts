import {
  AUTHOR_NAME,
  FUNDING_COFFEE_URL,
  FUNDING_GITHUB_URL,
  HOMEPAGE_URL,
  PLUGIN_ID,
} from "@/constants";
import type { ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

const PREF_PREFIX = "extensions.zotero.uts-citation";
const PREF_FIRST_RUN = `${PREF_PREFIX}.firstRun`;
const PREF_VERSION = `${PREF_PREFIX}.version`;

declare const Services: {
  prefs: {
    getBoolPref: (key: string, fallback: boolean) => boolean;
    setBoolPref: (key: string, value: boolean) => void;
    getCharPref: (key: string, fallback: string) => string;
    setCharPref: (key: string, value: string) => void;
  };
};

function getPref(key: string, fallback: boolean): boolean {
  try {
    return Services.prefs.getBoolPref(key, fallback);
  } catch {
    return fallback;
  }
}

function setPref(key: string, value: boolean): void {
  try {
    Services.prefs.setBoolPref(key, value);
  } catch (e) {
    Zotero.debug(`UTS Citation: Failed to set pref ${key}: ${e}`);
  }
}

function getCharPref(key: string, fallback: string): string {
  try {
    return Services.prefs.getCharPref(key, fallback);
  } catch {
    return fallback;
  }
}

function setCharPref(key: string, value: string): void {
  try {
    Services.prefs.setCharPref(key, value);
  } catch (e) {
    Zotero.debug(`UTS Citation: Failed to set char pref ${key}: ${e}`);
  }
}

export function isFirstRun(): boolean {
  return getPref(PREF_FIRST_RUN, true);
}

export function markFirstRunComplete(): void {
  setPref(PREF_FIRST_RUN, false);
}

export function getInstalledVersion(): string {
  return getCharPref(PREF_VERSION, "");
}

export function setInstalledVersion(version: string): void {
  setCharPref(PREF_VERSION, version);
}

export function showWelcomeNotification(): void {
  try {
    const pw = new Zotero.ProgressWindow();
    pw.changeHeadline("UTS APA 7th Citation Installed!");
    pw.addDescription(
      `Thank you for installing UTS Citation!\n\n` +
        `Use Ctrl+Shift+U (Cmd+Shift+U on Mac) to copy citations.\n\n` +
        `If you find this plugin helpful, please consider supporting development.`,
    );
    pw.show();
    pw.startCloseTimer(8000);
  } catch (e) {
    Zotero.debug(`UTS Citation: Welcome notification error: ${e}`);
  }
}

export function checkFirstRun(currentVersion: string): void {
  const isFirst = isFirstRun();
  const installedVersion = getInstalledVersion();

  if (isFirst || installedVersion !== currentVersion) {
    showWelcomeNotification();
    markFirstRunComplete();
    setInstalledVersion(currentVersion);
  }
}

export function registerPreferencePane(rootURI: string): void {
  try {
    const Zotero7 = Zotero as ZoteroAPI & {
      PreferencePanes?: {
        register: (options: {
          pluginID: string;
          src: string;
          label: string;
          image: string;
          defaultXUL?: boolean;
        }) => void;
      };
    };

    if (Zotero7.PreferencePanes) {
      Zotero7.PreferencePanes.register({
        pluginID: PLUGIN_ID,
        src: `${rootURI}content/preferences.xhtml`,
        label: "UTS Citation",
        image: `${rootURI}content/icon.svg`,
        defaultXUL: true,
      });
      Zotero.debug("UTS Citation: Preference pane registered");
    }
  } catch (e) {
    Zotero.debug(`UTS Citation: Failed to register preference pane: ${e}`);
  }
}

export function onPrefsEvent(type: string, _data: { window: Window }): void {
  switch (type) {
    case "load":
      Zotero.debug("UTS Citation: Preferences loaded");
      break;
    default:
      break;
  }
}

export function getAboutInfo(): {
  author: string;
  homepage: string;
  funding: { github: string; coffee: string };
} {
  return {
    author: AUTHOR_NAME,
    homepage: HOMEPAGE_URL,
    funding: {
      github: FUNDING_GITHUB_URL,
      coffee: FUNDING_COFFEE_URL,
    },
  };
}
