import { Request, Response, NextFunction } from "express";
import { auth } from "../config/db.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        req.user = session.user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        if (session.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden. Admins only." });
        }

        req.user = session.user;
        next();
    } catch (error) {
        console.error("Admin Middleware Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
