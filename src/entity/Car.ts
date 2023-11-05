import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
// import {IsOptional, Length, IsNotEmpty, IsPositive, Max, MaxLength} from 'class-validator'
@Entity()
export class Car {
	@PrimaryGeneratedColumn()
	@Column()
		id: number

	@Column()
		make: string

	@Column()
		model: string

	@Column()
		year: number

	@Column()
		color: string

	@Column()
		engine: string
}
