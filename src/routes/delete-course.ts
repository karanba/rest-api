import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSources } from "../data-source";
import { Course } from "../models/course";
import { isInteger } from "../utils";
import { Lesson } from "../models/lesson";

export async function deleteCourse(request: Request, response: Response, next: NextFunction) {
	try {
		logger.debug("Called deleteCourse()");
		const courseId = request.params.courseId;

		if (!isInteger(courseId)) {
			throw `Invalid course Id ${courseId}`;
		}

		await AppDataSources.manager.transaction(async (transactionalEntityManager) => {
			await transactionalEntityManager
				.createQueryBuilder()
				.delete()
				.from(Lesson)
				.where("courseId=:courseId", { courseId })
				.execute();

			await transactionalEntityManager
				.createQueryBuilder()
				.delete()
				.from(Course)
				.where("id=:courseId", { courseId })
				.execute();
		});

		response.status(200).json({ message: `Course deleted successfully: ${courseId}` });
	} catch (error) {
		logger.error("Error Calling deleteCourse()", error);
		next(error);
	}
}
