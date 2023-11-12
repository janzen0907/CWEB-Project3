import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {IsOptional, Length, IsNotEmpty, Max, Min} from 'class-validator'

@Entity()
export class Car {
	@PrimaryGeneratedColumn()
	@IsOptional()
		id: number


	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Make must be from $constraint1 to $constraint2 characters'})
	@IsNotEmpty({message: 'Make is required'})
		make: string

	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Model must be from $constraint1 to $constraint2 characters'})
	@IsNotEmpty({message: 'Model is required'})
		model: string

	@Column('int', {})
	@Max(2024, {message: 'Year must be earlier than 2025'})
	@Min(1908, {message: 'Year must be later than 1908'})
		year: number

	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Color must not exceed $constraint2 characters in length'})
	@IsOptional()
		color: string

	@Column('nvarchar', {length: 50})
	@Length(1,50, {message: 'Engine must be between $constraint1 and $constraint2 characters'})
	@IsOptional()
		engine: string
}
