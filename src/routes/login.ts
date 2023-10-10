import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSources } from "../data-source";
import { calculatePasswordHash } from "../utils";
import { User } from "../models/user";
const crypto = require("crypto");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export async function login(request: Request, response: Response, next: NextFunction) {
	try {
		logger.debug("Called login()");
		const { email, password } = request.body;

		if (!email) {
			throw `Could not extract the email from request, aborting.`;
		}

		if (!password) {
			throw `Could not extract the password from request, aborting.`;
		}

		const user = await AppDataSources.getRepository(User)
			.createQueryBuilder("users")
			.where("email = :email", { email })
			.getOne();

		if (!user) {
			const message = "Login is denied.";
			logger.info(`${message} - ${email}`);
			response.status(403).json({ message });
			return;
		}

		const passwordHash = await calculatePasswordHash(password, user.passwordSalt);
		if (passwordHash !== user.passwordHash) {
			const message = "Login is denied.";
			logger.info(`${message} - ${email}`);
			response.status(403).json({ message });
			return;
		}

		logger.info(`User ${email} has now logged in.`);

		const { pictureUrl, isAdmin } = user;
		const authJwt = {
			userId: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		};

		const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);

		response.status(200).json({ user: { email, pictureUrl, isAdmin }, authJwtToken });
	} catch (error) {
		logger.error("Error Calling login()", error);
		return next(error);
	}
}
