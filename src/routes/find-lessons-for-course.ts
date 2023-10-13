import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../logger';
import { AppDataSources } from '../data-source';
import { Lesson } from '../models/lesson';
import { isInteger } from '../utils';

export async function findLessonsForCourse(request: Request, response: Response, next: NextFunction) {
	try {
		logger.debug('Called findLessonsForCourse()');
		const courseId = request.params.courseId;
		const query = request.query as any;
		const pageNumber = query?.pageNumber ?? '0';
		const pageSize = query?.pageSize ?? '3';

		if (!isInteger(courseId)) {
			throw `Invalid course Id ${courseId}`;
		}

		if (!isInteger(pageNumber)) {
			throw `Invalid page number ${pageNumber}`;
		}

		if (!isInteger(pageSize)) {
			throw `Invalid page size ${pageSize}`;
		}

		const lessons = await AppDataSources.getRepository(Lesson)
			.createQueryBuilder('lessons')
			.where('lessons.courseId = :courseId', { courseId })
			.orderBy('lessons.seqNo')
			.skip(pageNumber * pageSize)
			.take(pageSize)
			.getMany();

		response.status(200).json({ lessons });
	} catch (error) {
		logger.error('Error Calling findLessonsForCourse()', error);
		next(error);
	}
}
