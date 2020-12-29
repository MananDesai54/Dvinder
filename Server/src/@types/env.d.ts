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
  }
}
