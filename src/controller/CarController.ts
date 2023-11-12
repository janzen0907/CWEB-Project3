import {Request, Response} from 'express'
import {Car} from '../entity/Car'
import {validate, ValidatorOptions} from 'class-validator'
import {AppDataSource} from '../data-source'
import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from 'routing-controllers'
import {Like} from 'typeorm'

//@Controller('/Cars')
@JsonController()
export default class CarController {
	private CarRepo = AppDataSource.getRepository(Car) // Car Repository
	// https://github.com/typestack/class-validator#passing-options
	private validOptions: ValidatorOptions = {
		stopAtFirstError: true,
		skipMissingProperties: false,
		validationError: {target: false, value: false},
	}

	//@Route('get', '/:id*?') // the *? makes the param optional - see https://expressjs.com/en/guide/routing.html#route-paramters
	@Get('/cars/:id*?' )
	async read(@Req() req: Request, @Res() res: Response) {
		if (req.params.id) return this.CarRepo.findOne({where: {id: req.params.id}} )
		else {
			const searchString = req.query.params
			const findOptions: any = {order: {}, where: []} // prepare order and where props
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

	//@Route('delete', '/:id')
	@Delete('/cars/:id')
	async delete(@Req() req: Request, @Res() res: Response) {
		const CarToRemove = await this.CarRepo.findOne(  {where: {id: req.params.id}})
		res.statusCode = 204
		if (CarToRemove) return this.CarRepo.remove(CarToRemove)
		else{
			//do nothing
		} //next()
	}

	//@Route('put', '/:id')
	@Put('/cars/:confirmid')
	async update(@Body() reqBody: any, @Param('confirmid') confirmid: number, @Res() res: Response) {
		/*     PRELOAD - https://typeorm.io/#/repository-api
        Creates a new entity from the plain javascript object.
        If the entity already exists in the database, then it loads it and replaces all values with the new ones from the given object,
        and returns a new entity that is actually an entity loaded from the database with all properties replaced from the new object.
        Note that given entity-like object must have an entity id / primary key to find entity by.
        Returns undefined if entity with given id was not found.
    */
		const CarToUpdate = await this.CarRepo.preload(reqBody)

		// Extra validation - ensure the id param matched the id submitted in the body
		if (!CarToUpdate || CarToUpdate.id != confirmid){
			// do nothing
		} //next() // pass the buck until 404 error is sent
		else {
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
	async create(@Body() reqBody:any,@Res() res:Response){
		const CarToCreate = Object.assign(new Car(), reqBody)
		const violations = await validate(CarToCreate, this.validOptions)
		if (violations.length) {
			res.statusCode = 422 // Unprocessable Entity
			return violations
		} else {
			return this.CarRepo.save(CarToCreate)
		}
	}
}
