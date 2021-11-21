import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const authToken = (request: Request, response: Response, next: NextFunction) => {
    const token = request.body.token;

    if (!token) {
        response.status(404);
        return next("Token required");
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        response.user = decoded;
    } catch (err) {
        response.status(404);
        return next("Invalid token");
    }
}

export default authToken;
