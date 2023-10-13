import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../logger';

export function defaultErrorHandler(err, request: Request, response: Response, next: NextFunction) {
	logger.error('Default error handler triggered; reason: ', err);

	if (response.headersSent) {
		logger.error('Response was already being written, delegating to build-in Express error handler.');

		next(err);
		return;
	}

	response.status(500).json({ status: 'error', message: 'Default error handling triggered, please check logs' });
}
