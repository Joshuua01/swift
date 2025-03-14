import csv from "csv-parser";
import { SwiftCode } from "../models/SwiftCode";
import fs from "fs";

export async function parseSwiftCsv(filePath: string): Promise<SwiftCode[]> {
  return new Promise((resolve, reject) => {
    const results: SwiftCode[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        try {
          const swift = new SwiftCode();
          swift.swiftCode = data["SWIFT CODE"]?.trim();
          swift.bankName = data["NAME"]?.trim();
          swift.address = data["ADDRESS"]?.trim();
          swift.countryISO2 = data["COUNTRY ISO2 CODE"]?.trim().toUpperCase();
          swift.countryName = data["COUNTRY NAME"]?.trim().toUpperCase();
          swift.isHeadquarter = swift.swiftCode?.endsWith("XXX");

          if (swift.swiftCode && swift.bankName && swift.address && swift.countryISO2 && swift.countryName) {
            results.push(swift);
          }
        } catch (error) {
          console.error("Błąd parsowania" + error);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
