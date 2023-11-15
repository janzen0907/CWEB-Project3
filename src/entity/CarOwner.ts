import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {IsOptional, Length, IsNotEmpty, IsEmail, IsPhoneNumber, MaxLength} from 'class-validator'

const emailOptions ={
	allow_display_name: false,
	ignore_max_length: false,
	allow_ip_domain: false,
	domain_specific_validation: true,
}
@Entity()
export class CarOwner {
	@PrimaryGeneratedColumn()
	@IsOptional()
		id: number

	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'First Name must be between $constraint1 and $constraint2 characters'})
	@IsNotEmpty({message: 'First name is required'})
		firstName: string

	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Last Name must be between $constraint1 and $constraint2 characters'})
	@IsNotEmpty({message: 'Last name is required'})
		lastName: string

	@Column('varchar', {length: 320, nullable: false})
	@IsEmail(emailOptions, {message: 'Email must be in the proper format'})
	@IsNotEmpty({message: 'Email is Required'})
		email: string


	@Column('varchar', {length: 15, nullable: false})
	@Length(7, 17, {message: 'Phone Number must be from $constraint1 to $constraint2 characters'})
	@IsPhoneNumber('CA', {message: 'Phone Number Must be a valid Canadian format'})
	@IsNotEmpty({message: 'Phone number is Required'})
		phone: string

	@Column('varchar', {length: 50, nullable: true})
	@MaxLength( 150, {message: 'Address can be at most $constraint1 characters '})
	@IsOptional()
		address: string
}
