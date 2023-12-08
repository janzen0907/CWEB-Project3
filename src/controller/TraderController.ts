import {Request, Response} from 'express'
import {CarOwner} from '../entity/CarOwner'
import {validate, ValidatorOptions} from 'class-validator'
import {AppDataSource} from '../data-source'
import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from 'routing-controllers'
import {Like} from 'typeorm'
import {Trader} from '../entity/Trader'
import {Car} from '../entity/Car'
import CarController from './CarController'


@JsonController()
export default class TraderController {
	private TraderRepo = AppDataSource.getRepository(Trader) // Trader Repository
	public CarRepo = AppDataSource.getRepository(Car) // Car Repository
	private validOptions: ValidatorOptions = {
		stopAtFirstError: true,
		skipMissingProperties: false,
		validationError: {target: false, value: false},

	}

	//Get request for the Car entity
	@Get('/traders/:id*?')
	async read(@Req() req: Request, @Res() res: Response) {
		if (req.params.id) return this.TraderRepo.findOne({where: {id: req.params.id}})
		else {
			const searchString = req.query.params
			const findOptions: any = {order: {}, where: []}
			const existingFields = this.TraderRepo.metadata.ownColumns.map((col) => col.propertyName)
			const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
			findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'


			if (searchString) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				for (const prop: string of existingFields) {
					findOptions.where.push({[prop]: Like(`%${searchString}`)})
				}
			}

			return this.TraderRepo.find(findOptions)
		}
	}

	@Delete('/traders/:email')
	async delete(@Req() req: Request, @Res() res: Response) {

		const emailToDelete = req.params.email
		try {
			// Find the trader to be deleted
			const traderToRemove = await this.TraderRepo.findOne({where: {email: emailToDelete}})

			// If the trader is found, proceed with deletion
			if (traderToRemove) {
				// Delete associated cars
				await this.deleteAssociatedCars(emailToDelete)

				// Remove the trader
				await this.TraderRepo.remove(traderToRemove)
				console.log(traderToRemove)
				console.log(emailToDelete)

				res.status(204).send()
			} else {
				res.status(404).json({message: 'Trader not found'})
			}
		} catch (err) {
			console.error(err)
			res.status(500).json({message: 'Internal Server Error'})
		}
	}

	private async deleteAssociatedCars(email: string): Promise<void> {
		const carsToDelete = await this.CarRepo.find({where: {traderEmail: email}})

		// Delete each associated car
		for (const car of carsToDelete) {
			await this.CarRepo.remove(car)
		}
	}


	@Put('/traders/:confirmid')
	async update(@Body() reqBody: any, @Param('confirmid') confirmid: number, @Res() res: Response, @Req() req: Request) {
		//Check the headers for the authorization token
		//const token = req.headers.authorization
		//If token is Bearer admin then they can Update then entry in the DB
		//if(token == 'Bearer admin')
		{//
			const TraderToUpdate = await this.TraderRepo.preload(reqBody)
			if (!TraderToUpdate || TraderToUpdate.id != confirmid) {
				// do nothing
			} else {
				const violations = await validate(TraderToUpdate, this.validOptions)
				if (violations.length) {
					res.statusCode = 422 // Unprocessable Entity
					return violations
				} else {
					return this.TraderRepo.save(TraderToUpdate)
				}
			}
			//They do not have access return a message
			//} else{
			//await  res.status(403).json({message: 'You do not have access'})
		}

	}

	@Post('/traders')
	async create(@Body() reqBody: any, @Res() res: Response, @Req() req: Request) {
		//Check the headers for the authorization token
		console.log(reqBody)
		//const token = req.headers.authorization
		//If token is Bearer admin then they can Update then entry in the DB
		//if (token == 'Bearer admin') {
		const TraderToCreate = Object.assign(new Trader(), reqBody)
		const violations = await validate(TraderToCreate, this.validOptions)
		if (violations.length) {
			res.statusCode = 422 // Unprocessable Entity
			console.log(violations)
			return violations
		} else {
			return this.TraderRepo.save(TraderToCreate)
		}
		//}
		//They do not have access return a message
		//else
		//{
		//	await  res.status(403).json({message: 'You do not have access'})
		//}
	}


}
