import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const pgOptions = {
  transform: {
    ...postgres.camel,
  },
};

export const sql = postgres(process.env.DB_URL, pgOptions);
