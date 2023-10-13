import * as dotenv from 'dotenv';
const result = dotenv.config();

import 'reflect-metadata';
import { AppDataSources } from '../data-source';
import { Lesson } from './lesson';
import { Course } from './course';
import { User } from './user';

async function deleteDb() {
	await AppDataSources.initialize();
	console.log('Database initialized');

	console.log('Clearing LESSONS table');
	await AppDataSources.getRepository(Lesson).delete({});

	console.log('Clearing COURSES table');
	await AppDataSources.getRepository(Course).delete({});

	console.log('Clearing USERS table');
	await AppDataSources.getRepository(User).delete({});
}

deleteDb()
	.then(() => {
		console.log('Finished deleting database, exiting!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Failed to delete database', err);
	});
