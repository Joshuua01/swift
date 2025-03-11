import "reflect-metadata";
import { DataSource } from "typeorm";
import { SwiftCode } from "./models/SwiftCode";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
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

AppDataSource.initialize()
  .then(async () => {
    console.log("Database started!");
  })
  .catch((error) => console.log(error));
