import {Request, Response} from 'express'
import {CarOwner} from '../entity/CarOwner'
import {validate, ValidatorOptions} from 'class-validator'
import {AppDataSource} from '../data-source'
import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from 'routing-controllers'
import {Like} from 'typeorm'
import {Trader} from "../entity/Trader";


@JsonController()
export default class TraderController {
	private TraderRepo = AppDataSource.getRepository(Trader) // Car Repository
	private validOptions: ValidatorOptions = {
		stopAtFirstError: true,
		skipMissingProperties: false,
		validationError: {target: false, value: false},

	}

	//Get request for the Car entity
	@Get('/trader/:id*?' )
	async read(@Req() req: Request, @Res() res: Response) {
		if (req.params.id) return this.TraderRepo.findOne({where: {id: req.params.id}} )
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

	@Delete('/trader/:id')
	async delete(@Req() req: Request, @Res() res: Response) {
		//Check the headers for the authorization token
		const token = req.headers.authorization
		//If token is Bearer admin then they can delete from the db
		if(token == 'Bearer admin')
		{
			const TraderToRemove = await this.TraderRepo.findOne(  {where: {id: req.params.id}})
			res.statusCode = 204
			if (TraderToRemove) return this.TraderRepo.remove(TraderToRemove)
			else{

			}
		}
		//They do not have access return a message
		else
		{
			await  res.status(403).json({message: 'You do not have access'})
		}

	}

	@Put('/trader/:confirmid')
	async update(@Body() reqBody: any, @Param('confirmid') confirmid: number, @Res() res: Response, @Req() req: Request) {
		//Check the headers for the authorization token
		const token = req.headers.authorization
		//If token is Bearer admin then they can Update then entry in the DB
		if(token == 'Bearer admin')
		{
			const TraderToUpdate = await this.TraderRepo.preload(reqBody)
			if (!TraderToUpdate || TraderToUpdate.id != confirmid){
				// do nothing
			}
			else {
				const violations = await validate(TraderToUpdate, this.validOptions)
				if (violations.length) {
					res.statusCode = 422 // Unprocessable Entity
					return violations
				} else {
					return this.TraderRepo.save(TraderToUpdate)
				}
			}
			//They do not have access return a message
		} else{
			await  res.status(403).json({message: 'You do not have access'})
		}

	}

	@Post('/trader')
	async create(@Body() reqBody:any,@Res() res:Response, @Req() req: Request) {
		//Check the headers for the authorization token
		const token = req.headers.authorization
		//If token is Bearer admin then they can Update then entry in the DB
		if (token == 'Bearer admin') {
			const TraderToCreate = Object.assign(new Trader(), reqBody)
			const violations = await validate(TraderToCreate, this.validOptions)
			if (violations.length) {
				res.statusCode = 422 // Unprocessable Entity
				return violations
			} else {
				return this.TraderRepo.save(TraderToCreate)
			}
		}
		//They do not have access return a message
		else
		{
			await  res.status(403).json({message: 'You do not have access'})
		}
	}


}
