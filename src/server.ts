import * as dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
  console.log("Error loading environment variables, aborting.");
  process.exit(1);
}

import * as express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";
import { logger } from "./logger";

const app = express();

function setupExpress() {
  app.route("/").get(root);
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

setupExpress();
startServer();
