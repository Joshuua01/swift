import { NextFunction, Request, Response } from "express";
import { validateData } from "../../src/lib/validateData";
import { swiftCodeSchema } from "../../src/models/SwiftCodeSchema";

const mockRequest = (body: any): Partial<Request> => ({ body });
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};
const nextFunction: NextFunction = jest.fn();

describe("validateData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if data is valid", () => {
    const validData = {
      swiftCode: "ABCDEF12XXX",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
    };
    const req = mockRequest(validData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return error for invalid swiftCode (too short)", () => {
    const invalidData = {
      swiftCode: "ABC123",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("swiftCode");
    expect(errorMsg).toContain("String must contain at least 8 character(s)");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return error for invalid swiftCode (too long)", () => {
    const invalidData = {
      swiftCode: "ABC1234567890",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("swiftCode");
    expect(errorMsg).toContain("String must contain at most 11 character(s)");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return error for invalid swiftCode (invalid characters)", () => {
    const invalidData = {
      swiftCode: "ABC12345!",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("swiftCode");
    expect(errorMsg).toContain("Invalid SWIFT code format");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return error for missing fields", () => {
    const invalidData = {
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("swiftCode");
    expect(errorMsg).toContain("Required");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return error for invalid countryISO2 (wrong length)", () => {
    const invalidData = {
      swiftCode: "ABCDEF12XXX",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "USA",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("countryISO2");
    expect(errorMsg).toContain("String must contain exactly 2 character(s)");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return error for invalid countryISO2 (invalid characters)", () => {
    const invalidData = {
      swiftCode: "ABCDEF12XXX",
      bankName: "Test Bank",
      address: "123 Test Street",
      countryISO2: "U1",
      countryName: "United States",
      isHeadquarter: false,
    };

    const req = mockRequest(invalidData) as Request;
    const res = mockResponse();

    validateData(swiftCodeSchema)(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    const { message: errorMsg } = (res.json as jest.Mock).mock.calls[0][0];
    expect(errorMsg).toContain("countryISO2");
    expect(errorMsg).toContain("Invalid country code");
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
