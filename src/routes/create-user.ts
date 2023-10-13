import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../logger';
import { AppDataSources } from '../data-source';
import { Course } from '../models/course';
import { calculatePasswordHash } from '../utils';
import { User } from '../models/user';
const crypto = require('crypto');

export async function createUser(request: Request, response: Response, next: NextFunction) {
	try {
		logger.debug('Called createUser()');
		const { email, pictureUrl, password, isAdmin } = request.body;

		if (!email) {
			throw `Could not extract the email from request, aborting.`;
		}

		if (!password) {
			throw `Could not extract the password from request, aborting.`;
		}

		const repository = AppDataSources.getRepository(User);
		const user = await repository.createQueryBuilder('users').where('email = :email', { email }).getOne();
		if (user) {
			const message = `User with this ${email} is already exists, aborting.`;
			logger.error(message);
			response.status(500).json({ message });
		}

		const passwordSalt = crypto.randomBytes(64).toString('hex');
		const passwordHash = await calculatePasswordHash(password, passwordSalt);

		const newUser = repository.create({
			email,
			pictureUrl,
			isAdmin,
			passwordHash,
			passwordSalt,
		});

		await AppDataSources.manager.save(newUser);
		logger.info(`User ${email} has been created.`);

		response.status(200).json({ email, pictureUrl, isAdmin });
	} catch (error) {
		logger.error('Error Calling createUser()', error);
		next(error);
	}
}
