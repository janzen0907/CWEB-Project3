import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Car } from './entity/Car'
import {CarOwner} from './entity/CarOwner'
import {Trader} from "./entity/Trader";

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: 'sqlite.db',
	// I changed sync to false because it was trying to create a new table
	//every time the server is ran.
	synchronize: false,
	logging: false,
	entities: [Car, Trader],
	migrations: [],
	subscribers: [],
})
