import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Car } from './entity/Car'

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: 'sqlite.db',
	synchronize: true,
	logging: false,
	entities: [Car],
	migrations: [],
	subscribers: [],
})
