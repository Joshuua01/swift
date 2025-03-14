import "reflect-metadata";
import { DataSource } from "typeorm";
import { SwiftCode } from "./models/SwiftCode";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: "swift",
  password: "swift",
  database: "swiftdb",
  synchronize: true,
  logging: false,
  entities: [SwiftCode],
  migrations: [],
  subscribers: [],
});

const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  dropSchema: true,
  entities: [SwiftCode],
});

export const dataSource = process.env.NODE_ENV === "test" ? TestDataSource : AppDataSource;
