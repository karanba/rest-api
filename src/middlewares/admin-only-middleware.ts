import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../logger';
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

export function checkIfAdmin(request: Request, response: Response, next: NextFunction) {
	const user = request.user;
	if (!user?.isAdmin) {
		logger.error('The user is not an admin, access denied.');
		response.sendStatus(403);
		return;
	}

	logger.info('The user is a valid admin, granting access.');

	next();
}
