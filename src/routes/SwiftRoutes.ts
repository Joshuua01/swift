import express from "express";
import {
  createSwiftCode,
  deleteSwiftCode,
  getSwiftCodeDetails,
  getSwiftCodesByCountry,
} from "../controllers/SwiftController";
import { validateData } from "../lib/validateData";
import { swiftCodeSchema } from "../models/SwiftCodeSchema";

const router = express.Router();

router.get("/:swiftCode", getSwiftCodeDetails);
router.get("/country/:countryISO2code", getSwiftCodesByCountry);

router.post("/", validateData(swiftCodeSchema), createSwiftCode);
router.delete("/:swiftCode", deleteSwiftCode);

export default router;
