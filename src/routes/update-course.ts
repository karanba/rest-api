import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../logger';
import { AppDataSources } from '../data-source';
import { Course } from '../models/course';
import { isInteger } from '../utils';

export async function updateCourse(request: Request, response: Response, next: NextFunction): Promise<void> {
	try {
		logger.debug('Called updateCourse()');
		const courseId = request.params.courseId;
		const changes = request.body;

		if (!isInteger(courseId)) {
			throw Error(`Invalid course Id ${courseId}`);
		}
		console.log(changes);
		await AppDataSources.createQueryBuilder()
			.update(Course)
			.set(changes)
			.where('id = :courseId', { courseId })
			.execute();

		response.status(200).json({
			message: `Course ${courseId} updated successfully`,
		});
	} catch (error) {
		logger.error('Error Calling updateCourse()', error);
		next(error);
	}
}
