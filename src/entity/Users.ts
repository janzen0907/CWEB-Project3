import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {IsOptional, Length} from 'class-validator'

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
	@IsOptional()
    	id: number

    @Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Username must be from $constraint1 to $constraint2 characters'})
    	username: string

    @Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Accesslevel must be from $constraint1 to $constraint2 characters'})
    	accessLevel: string

}
