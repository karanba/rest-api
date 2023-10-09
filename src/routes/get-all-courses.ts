import { Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSources } from "../data-source";
import { Course } from "../models/course";

export async function getAllCourses(request: Request, response: Response) {
	logger.debug("Called getAllCourses()");

	const courses = await AppDataSources.getRepository(Course)
		.createQueryBuilder("courses")
		.orderBy("courses.seqNo")
		.getMany();

	response.status(200).json(courses);
}
