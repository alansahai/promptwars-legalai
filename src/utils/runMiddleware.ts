import type { NextApiRequest, NextApiResponse } from "next";

/** The shape every Express-style middleware (multer included) actually calls at runtime. */
export type ExpressStyleMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (result: unknown) => void
) => void;

/**
 * Adapts an Express-style middleware (like multer) so it can be awaited
 * inside a Next.js pages/api handler, which does not have Express's
 * middleware chaining built in. Express middleware is typed against
 * express.Request/Response, which is structurally different from
 * NextApiRequest/NextApiResponse even though both are plain Node
 * req/res objects at runtime — callers cast to ExpressStyleMiddleware
 * at the boundary to bridge the two type systems.
 */
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  middleware: ExpressStyleMiddleware
): Promise<void> {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result: unknown) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }
      resolve();
    });
  });
}
