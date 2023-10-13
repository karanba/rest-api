import { Lesson } from './models/lesson';
import { DataSource } from 'typeorm';
import { Course } from './models/course';
import { User } from './models/user';

export const AppDataSources: DataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process?.env?.DB_PORT ?? '9000', 10),
	database: process.env.DB_NAME,
	ssl: false,
	extra: {
		ssl: false,
	},
	entities: [Course, Lesson, User],
	synchronize: true,
	logging: true,
});
