import * as dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
	console.log("Error loading environment variables, aborting.");
	process.exit(1);
}

import "reflect-metadata";
import * as express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";
import { logger } from "./logger";
import { AppDataSources } from "./data-source";
import { getAllCourses } from "./routes/get-all-courses";
import { defaultErrorHandler } from "./middlewares/default-error-handler";
import { findCourseByUrl } from "./routes/find-course-by-url";
import { findLessonsForCourse } from "./routes/find-lessons-for-course";
import { updateCourse } from "./routes/update-course";
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

function setupExpress() {
	app.use(cors({ origin: true }));
	app.use(bodyParser.json());
	app.route("/").get(root);
	app.route("/api/courses").get(getAllCourses);
	app.route("/api/courses/:courseUrl").get(findCourseByUrl);
	app.route("/api/courses/:courseId/lessons").get(findLessonsForCourse);
	app.route("/api/courses/:courseId").patch(updateCourse);
	app.use(defaultErrorHandler);
}

function startServer() {
	const portArg = process.argv[2];
	let port: number;
	const portEnv = process.env.PORT;

	if (isInteger(portEnv)) {
		port = parseInt(portEnv, 10);
	}

	if (!port && isInteger(portArg)) {
		port = parseInt(portArg, 10);
	}

	if (!port) {
		port = 9000;
	}

	app.listen(port, () => {
		logger.info(`HTTP REST API Server is now running at http://localhost:${port}`);
	});
}

AppDataSources.initialize()
	.then(() => {
		logger.info("The data source has been initialized successfully");
		setupExpress();
		startServer();
	})
	.catch((err) => {
		logger.error("Error during data source initialization", err);
		process.exit(1);
	});
