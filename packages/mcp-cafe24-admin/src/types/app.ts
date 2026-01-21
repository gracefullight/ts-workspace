export type AppExtensionType = "section" | "embedded";

export interface AppInfo {
  version: string | null;
  version_expiration_date: string | null;
  initial_version: string | null;
  previous_version: string | null;
  extension_type: AppExtensionType | null;
}

export interface AppGetResponse {
  app: AppInfo;
}

export interface AppUpdateRequest {
  request: {
    version: string;
    extension_type: AppExtensionType;
  };
}

export interface AppUpdateResponse {
  app: {
    version: string;
    extension_type: AppExtensionType;
  };
}
