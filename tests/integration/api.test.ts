import { app } from "../../src/app";
import request from "supertest";
import { dataSource } from "../../src/data-source";
import { SwiftCode } from "../../src/models/SwiftCode";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await dataSource.initialize();
});

beforeEach(async () => {
  await dataSource.getRepository(SwiftCode).clear();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("Integration tests for SWIFT Codes API", () => {
  const headquarterData = {
    swiftCode: "HQTEST01XXX",
    bankName: "Headquarter Bank",
    address: "1 Main Street",
    countryISO2: "US",
    countryName: "United States",
    isHeadquarter: true,
  };

  const branchData = {
    swiftCode: "HQTEST01BRN",
    bankName: "Headquarter Bank",
    address: "2 Branch Ave",
    countryISO2: "US",
    countryName: "United States",
    isHeadquarter: false,
  };

  const countryData = {
    swiftCode: "CTRYTESTXX1",
    bankName: "Country Bank",
    address: "Country Street",
    countryISO2: "CA",
    countryName: "Canada",
    isHeadquarter: true,
  };

  describe("GET v1/swift-codes/:swiftCode", () => {
    it("should return 404 when swift code not found", async () => {
      const res = await request(app as any).get("/v1/swift-codes/NONEXISTENT");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Swift code not found");
    });

    it("should return swift code details for branch", async () => {
      await request(app as any)
        .post("/v1/swift-codes")
        .send(branchData);
      const res = await request(app as any).get(`/v1/swift-codes/${branchData.swiftCode}`);
      expect(res.status).toBe(200);
      expect(res.body.swiftCode).toBe(branchData.swiftCode);
      expect(res.body.branches).toBeUndefined();
    });

    it("should return swift code details for headquarter with branches", async () => {
      await request(app as any)
        .post("/v1/swift-codes")
        .send(headquarterData);
      await request(app as any)
        .post("/v1/swift-codes")
        .send(branchData);
      const res = await request(app as any).get(`/v1/swift-codes/${headquarterData.swiftCode}`);
      expect(res.status).toBe(200);
      expect(res.body.swiftCode).toBe(headquarterData.swiftCode);
      expect(res.body.branches).toBeInstanceOf(Array);
      expect(res.body.branches.length).toBeGreaterThanOrEqual(1);
    });
  });
  describe("GET /v1/swift-codes/country/:countryISO2code", () => {
    it("should return 404 when no swift codes exist for given country", async () => {
      const res = await request(app as any).get("/v1/swift-codes/country/XX");
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("No swift codes found for");
    });

    it("should return all swift codes for a given country", async () => {
      await request(app as any)
        .post("/v1/swift-codes")
        .send(countryData);
      const branchForCA = { ...countryData, swiftCode: "CTRYTESTBRN" };
      await request(app as any)
        .post("/v1/swift-codes")
        .send(branchForCA);

      const res = await request(app as any).get("/v1/swift-codes/country/CA");
      expect(res.status).toBe(200);
      expect(res.body.countryISO2).toBe("CA");
      expect(res.body.countryName).toBe(countryData.countryName);
      expect(res.body.swiftCodes).toBeInstanceOf(Array);
      expect(res.body.swiftCodes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("POST /v1/swift-codes", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app as any)
        .post("/v1/swift-codes")
        .send({
          bankName: "Incomplete Bank",
          address: "No SWIFT Code Street",
          countryISO2: "US",
          countryName: "United States",
          isHeadquarter: false,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid input: swiftCode - Required");
    });

    it("should return 400 if swift code already exists", async () => {
      await request(app as any)
        .post("/v1/swift-codes")
        .send(headquarterData);
      const res = await request(app as any)
        .post("/v1/swift-codes")
        .send(headquarterData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Swift code already exists");
    });

    it("should create a new swift code successfully", async () => {
      const res = await request(app as any)
        .post("/v1/swift-codes")
        .send(headquarterData);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Swift code created successfully");

      const getRes = await request(app as any).get(`/v1/swift-codes/${headquarterData.swiftCode}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.swiftCode).toBe(headquarterData.swiftCode);
    });
  });

  describe("DELETE /v1/swift-codes/:swiftCode", () => {
    it("should return 404 when trying to delete non-existing swift code", async () => {
      const res = await request(app as any).delete("/v1/swift-codes/NONEXISTENT");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Swift code not found");
    });

    it("should delete an existing swift code", async () => {
      const swiftToDelete = {
        swiftCode: "DELTESTTXXX",
        bankName: "Delete Bank",
        address: "Delete Street 1",
        countryISO2: "US",
        countryName: "United States",
        isHeadquarter: true,
      };

      const postRes = await request(app as any)
        .post("/v1/swift-codes")
        .send(swiftToDelete);
      console.log(postRes.body);
      expect(postRes.status).toBe(201);
      expect(postRes.body.message).toBe("Swift code created successfully");

      const getResBefore = await request(app as any).get(`/v1/swift-codes/${swiftToDelete.swiftCode}`);
      expect(getResBefore.status).toBe(200);
      expect(getResBefore.body.swiftCode).toBe(swiftToDelete.swiftCode);

      const deleteRes = await request(app as any).delete(`/v1/swift-codes/${swiftToDelete.swiftCode}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe("Swift code deleted successfully");

      const getResAfter = await request(app as any).get(`/v1/swift-codes/${swiftToDelete.swiftCode}`);
      expect(getResAfter.status).toBe(404);
      expect(getResAfter.body.message).toBe("Swift code not found");
    });
  });
});
