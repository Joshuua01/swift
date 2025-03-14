import { z } from "zod";

export const swiftCodeSchema = z.object({
  swiftCode: z
    .string()
    .min(8)
    .max(11)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid SWIFT code format"),
  bankName: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  countryISO2: z
    .string()
    .length(2)
    .regex(/^[a-zA-Z]+$/, "Invalid country code"),
  countryName: z.string().min(1).max(255),
  isHeadquarter: z.boolean(),
});
