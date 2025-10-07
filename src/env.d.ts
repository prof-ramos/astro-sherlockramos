/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly STRAPI_BASE_URL: string;
  readonly STRAPI_API_TOKEN: string;
  readonly STRAPI_WEBHOOK_SECRET: string;
  readonly CF_PAGES_COMMIT_SHA: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
