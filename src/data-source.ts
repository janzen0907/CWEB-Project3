import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Car } from './entity/Car'
import {CarOwner} from './entity/CarOwner'

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: 'sqlite.db',
	synchronize: true,
	logging: false,
	entities: [Car, CarOwner],
	migrations: [],
	subscribers: [],
})
