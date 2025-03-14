import { Request, Response } from "express";
import { SwiftCode } from "../models/SwiftCode";
import { Like } from "typeorm";
import { SwiftCodeRequest } from "../types/SwiftCodeRequest";
import { dataSource } from "../data-source";
const swiftRepository = dataSource.getRepository(SwiftCode);

export const getSwiftCodeDetails = async (req: Request<{ swiftCode: string }>, res: Response): Promise<void> => {
  const { swiftCode } = req.params;

  try {
    const swiftDetails = await swiftRepository.findOneBy({ swiftCode });

    if (!swiftDetails) {
      res.status(404).json({ message: "Swift code not found" });
      return;
    }

    if (swiftDetails.isHeadquarter) {
      const branches = await swiftRepository.find({
        where: {
          swiftCode: Like(`${swiftCode.substring(0, 8)}%`),
          isHeadquarter: false,
        },
      });
      const filteredBranches = branches.map(({ countryName, ...rest }) => rest);

      res.json({ ...swiftDetails, branches: filteredBranches });
      return;
    }

    res.json(swiftDetails);
    return;
  } catch (error) {
    console.error(`Problem fetching SWIFT: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getSwiftCodesByCountry = async (
  req: Request<{ countryISO2code: string }>,
  res: Response
): Promise<void> => {
  const { countryISO2code } = req.params;

  try {
    const swiftCodes = await swiftRepository.find({
      where: {
        countryISO2: countryISO2code.toUpperCase(),
      },
    });

    if (swiftCodes.length === 0) {
      res.status(404).json({ message: `No swift codes found for ${countryISO2code} country code` });
      return;
    }

    const countryName = swiftCodes[0].countryName;
    const filteredSwiftCodes = swiftCodes.map(({ countryName, ...rest }) => rest);

    res.json({
      countryISO2: countryISO2code,
      countryName: countryName,
      swiftCodes: filteredSwiftCodes,
    });
    return;
  } catch (error) {
    console.error(`Problem fetching SWIFT: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const createSwiftCode = async (req: Request<{}, {}, SwiftCodeRequest>, res: Response): Promise<void> => {
  const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = req.body;

  try {
    const existingSwift = await swiftRepository.findOneBy({ swiftCode });

    if (existingSwift) {
      res.status(400).json({ message: "Swift code already exists" });
      return;
    }

    const newSwift = new SwiftCode();
    newSwift.address = address;
    newSwift.bankName = bankName;
    newSwift.countryISO2 = countryISO2;
    newSwift.countryName = countryName;
    newSwift.isHeadquarter = isHeadquarter;
    newSwift.swiftCode = swiftCode;

    await swiftRepository.save(newSwift);

    res.status(201).json({ message: "Swift code created successfully" });
    return;
  } catch (error) {
    console.error(`Problem creating SWIFT: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const deleteSwiftCode = async (req: Request<{ swiftCode: string }>, res: Response): Promise<void> => {
  const { swiftCode } = req.params;

  try {
    const swiftDetails = await swiftRepository.findOneBy({ swiftCode });

    if (!swiftDetails) {
      res.status(404).json({ message: "Swift code not found" });
      return;
    }

    await swiftRepository.delete({ swiftCode });
    res.json({ message: "Swift code deleted successfully" });
    return;
  } catch (error) {
    console.error(`Problem deleting SWIFT: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
