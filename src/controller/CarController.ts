import {Request, Response} from 'express'
import {Car} from '../entity/Car'
import {validate, ValidatorOptions} from 'class-validator'
import {AppDataSource} from '../data-source'
import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from 'routing-controllers'
import {Like} from 'typeorm'
import {CarLookup} from '../entity/CarLookup'

@JsonController()
export default class CarController {
	private CarRepo = AppDataSource.getRepository(Car) // Car Repository
	private CarLookupRepo = AppDataSource.getRepository(CarLookup)
	private validOptions: ValidatorOptions = {
		stopAtFirstError: true,
		skipMissingProperties: false,
		validationError: {target: false, value: false},

	}

	//Get request for the Car entity
	@Get('/cars/:id*?')
	async read(@Req() req: Request, @Res() res: Response) {
		if (req.params.id) return this.CarRepo.findOne({where: {id: req.params.id}})
		else {
			const searchString = req.query.params
			const findOptions: any = {order: {}, where: []}
			const existingFields = this.CarRepo.metadata.ownColumns.map((col) => col.propertyName)
			const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
			findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'


			if (searchString) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				for (const prop: string of existingFields) {
					findOptions.where.push({[prop]: Like(`%${searchString}`)})
				}
			}

			return this.CarRepo.find(findOptions)
		}
	}

	@Delete('/cars/:id')
	async delete(@Req() req: Request, @Res() res: Response) {
		const CarToRemove = await this.CarRepo.findOne({where: {id: req.params.id}})
		res.statusCode = 204
		if (CarToRemove) return this.CarRepo.remove(CarToRemove)
		else {/* empty */}
	}

	@Put('/cars/:confirmid')
	async update(@Body() reqBody: any, @Param('confirmid') confirmid: number, @Res() res: Response, @Req() req: Request) {
		const CarToUpdate = await this.CarRepo.preload(reqBody)
		if (!CarToUpdate || CarToUpdate.id != confirmid) {
			// do nothing
		} else {
			const violations = await validate(CarToUpdate, this.validOptions)
			if (violations.length) {
				res.statusCode = 422 // Unprocessable Entity
				return violations
			} else {
				return this.CarRepo.save(CarToUpdate)
			}
		}
	}

	@Post('/cars')
	async create(@Body() reqBody: any, @Res() res: Response, @Req() req: Request) {
		console.log(reqBody)
		const CarToCreate = Object.assign(new Car(), reqBody)
		// Violations break the page
		 // const violations = await validate(CarToCreate, this.validOptions)
		 // if (violations.length) {
		 // 	res.statusCode = 422 // Unprocessable Entity
		 // 	return violations
		 // } else {
		return this.CarRepo.save(CarToCreate)
		 // }
	}

	// private async updateCarLookup(reqBody: any,carID: number): Promise<void> {
	// 	const carToUpdate = await this.CarLookupRepo.find({where: {carID: carID}})
	//
	// 	// add associated car to lookup table
	// 	for (const car of carToUpdate) {
	// 		const newCar = Object.assign(new Car(), reqBody)
	//
	// 		await this.CarRepo.upsert({
	// 			carID: newCar.id,
	// 			carMake: newCar.make,
	// 			carModel: newCar.model,
	// 			carYear: newCar.year,
	// 		}, car)
	// 	}
	// }
	
	
	
}


//}
