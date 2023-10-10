import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSources } from "../data-source";
import { Course } from "../models/course";

export async function getAllCourses(request: Request, response: Response, next: NextFunction) {
	try {
		logger.debug("Called getAllCourses()", request["user"]);

		const courses = await AppDataSources.getRepository(Course)
			.createQueryBuilder("courses")
			//.leftJoinAndSelect("courses.lessons", "LESSONS")
			.orderBy("courses.seqNo")
			.getMany();

		response.status(200).json(courses);
	} catch (error) {
		logger.error("Error Calling getAllCourses()", error);
		next(error);
	}
}
