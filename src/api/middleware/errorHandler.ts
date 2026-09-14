import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error("Unhandled error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";
  const message = isDevelopment ? err.message : "An error occurred. Please try again.";

  res.status(500).json({
    error: message,
    ...(isDevelopment && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}
