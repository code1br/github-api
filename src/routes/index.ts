import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../docs/swagger';
import { Express } from 'express';
import { routerUsers } from './user-routes';

export const routes = (app: Express) => {
	app.use(
		routerUsers
	);

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};