import * as dotenv from 'dotenv';
const result = dotenv.config();

import 'reflect-metadata';
import { COURSES, USERS } from './db-data';
import { AppDataSources } from '../data-source';
import { Course } from './course';
import { type DeepPartial } from 'typeorm';
import { Lesson } from './lesson';
import { User } from './user';
import { calculatePasswordHash } from '../utils';

async function populateDb() {
	await AppDataSources.initialize();
	console.log('Database initialized');

	const courses = Object.values(COURSES);
	const users = Object.values(USERS) as any[];
	const courseRepository = AppDataSources.getRepository(Course);
	const lessonRepository = AppDataSources.getRepository(Lesson);

	for (const courseData of courses) {
		console.log(`Inserting course ${courseData.title}`);
		const course = courseRepository.create(courseData);
		await courseRepository.save(course);

		for (const lessonData of courseData.lessons) {
			console.log(`Inserting lesson ${lessonData.title}`);
			const lesson = lessonRepository.create(lessonData);
			lesson.course = course;
			await lessonRepository.save(lesson);
		}
	}

	const userRepository = AppDataSources.getRepository(User);
	for (const userData of users) {
		console.log(`Inserting users ${userData.email}`);
		const { email, pictureUrl, isAdmin, passwordSalt, plainTextPassword } = userData;
		const user = userRepository.create({
			email,
			pictureUrl,
			isAdmin,
			passwordSalt,
			passwordHash: await calculatePasswordHash(plainTextPassword, passwordSalt),
		});
		await userRepository.save(user);
	}

	const totalCourses = await courseRepository.createQueryBuilder().getCount();
	const totalLessons = await lessonRepository.createQueryBuilder().getCount();

	console.log(`Data Inserted - courses: ${totalCourses} - lessons: ${totalLessons}`);
}

populateDb()
	.then(() => {
		console.log('Finished populating database, exiting!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Failed to populate database', err);
	});
