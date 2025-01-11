import { RequestHandler, Response, Request, NextFunction } from "express";

export default function asyncHandler(requestHandler: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}



