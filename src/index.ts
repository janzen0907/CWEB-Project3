// import * as express from 'express'
import * as bodyParser from 'body-parser'
// import { Request, Response } from 'express'
import { AppDataSource } from './data-source'
import CarController from './controller/CarController'
import * as createError from 'http-errors'
import {createExpressServer} from 'routing-controllers'
import TraderController from './controller/TraderController';

const corsOptions = {
	origin: /localhost\:\d{4,5}$/i, // localhost any 4 digit port
	credentials: true, // needed to set and return cookies
	allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization', //Headers that we will accept
	methods: 'GET,PUT,POST,DELETE',
	maxAge: 43200, // 12 hours
}



AppDataSource.initialize().then(async () => {

	// create express app
	const app = createExpressServer({
		cors: corsOptions, //sent the cors options
		controllers: [CarController, TraderController] //use the car controller

	})
	//app.use(bodyParser.json())
	app.use(bodyParser.json(), (err, req, res, next) => {
		if (err) {
			console.error(err)
			res.status(500).send('Error parsing request body')
		} else {
			next()
		}
	})

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
	console.log('Express server has started on port 3000. Open http://localhost:3000/traders to see results')


}).catch(error => console.log(error))
