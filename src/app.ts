import express from "express";
import "reflect-metadata";
import { SwiftCode } from "./models/SwiftCode";
import { parseSwiftCsv } from "./lib/fileParser";
import SwiftRoutes from "./routes/SwiftRoutes";
import { dataSource } from "./data-source";

export const app = express();
const port = 8080;

app.use(express.json());

app.use("/v1/swift-codes", SwiftRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

dataSource
  .initialize()
  .then(async () => {
    const swiftRepository = dataSource.getRepository(SwiftCode);
    if ((await swiftRepository.count()) === 0 && process.env.NODE_ENV !== "test") {
      const data = await parseSwiftCsv("./data/Interns_2025_SWIFT_CODES.csv");
      await swiftRepository.save(data);
      console.log("Database seeded");
    }
    console.log("Database started!");
  })
  .catch((error) => console.log(error));
