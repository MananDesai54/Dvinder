declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URL: string;
    PG_USERNAME: string;
    PG_PASSWORD: string;
    PG_DB_NAME: string;
    PORT: number;
    REDIS_SECRET: string;
    COOKIE_NAME: string;
    EMAIL_ID: string;
    EMAIL_PASSWORD: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_REDIRECT_URI: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_BUCKET_NAME: string;
    GOOGLE_API_KEY: string;
  }
}
