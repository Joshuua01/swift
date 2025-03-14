import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateData = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.errors.map((error) => `${error.path.join(".")} - ${error.message}`).join("; ");

      res.status(400).json({ message: `Invalid input: ${errorMessage}` });
      return;
    }

    next();
  };
};
