// import * as express from 'express'
import * as bodyParser from 'body-parser'
// import { Request, Response } from 'express'
import { AppDataSource } from './data-source'
import CarController from './controller/CarController'
import * as createError from 'http-errors'
import {createExpressServer} from 'routing-controllers'

const corsOptions = {
	origin: /localhost\:\d{4,5}$/i, // localhost any 4 digit port
	credentials: true, // needed to set and return cookies
	allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
	methods: 'GET,PUT,POST,DELETE',
	maxAge: 43200, // 12 hours
}

AppDataSource.initialize().then(async () => {

	// create express app
	const app = createExpressServer({
		cors: corsOptions,
		controllers: [CarController]
	})
	app.use(bodyParser.json())

	// register express routes from defined application routes
	// Routes.forEach(route => {
	// 	(app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
	// 		const result = (new (route.controller as any))[route.action](req, res, next)
	// 		if (result instanceof Promise) {
	// 			result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
	//
	// 		} else if (result !== null && result !== undefined) {
	// 			res.json(result)
	// 		}
	// 	})
	// })

	// setup express app here
	// ...
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		next(createError(404))
	})
	// error handler
	app.use(function(err, req, res, next) {
		if(!res._headerSent) {
			res.status(err.status || 500)
			res.json({status: err.status, message: err.message, stack: err.stack.split(/\s{4,}/)})
		}
	})

	// start express server
	app.listen(3000)

	console.log('Express server has started on port 3000. Open http://localhost:3000/cars to see results')

}).catch(error => console.log(error))
