import type * as express from 'express';

export function root(request: express.Request, response: express.Response): void {
	response.status(200).send('<h1>Express server is up an running..</h1>');
}
