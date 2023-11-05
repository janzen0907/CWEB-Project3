import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "sqlite.db",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
