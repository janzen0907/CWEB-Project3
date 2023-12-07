import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	ManyToOne
} from 'typeorm'
import {IsOptional, Length, IsNotEmpty, Max, Min} from 'class-validator'
import {Trader} from './Trader'

@Entity()
export class Car {
	@PrimaryGeneratedColumn('increment')
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
	@IsNotEmpty({message: 'Year is required'})
		year: number

	@Column('int', {})
	@IsNotEmpty({message: 'Kilometers is required'})
		km: number

	@Column('int', {})
	@IsNotEmpty({message: 'Price is required'})
		price: number

	@Column('nvarchar', {length: 3})
	@Length(3, 3, {message: 'Drivetrain must be in format: AWD, RWD or FWD only'})
	@IsNotEmpty({message: 'Drivetrain is required'})
		drivetrain: string

	@Column('nvarchar', {length: 50})
	@Length(1, 50, {message: 'Transmission must be between $Constraint1 and $Constrain2'})
	@IsNotEmpty({message: 'Transmission is required'})
		transmission: string


	 @Column('int', {default: 0})
	 @IsOptional()
	 	numUpVotes: number

	 @Column('int', {default: 0})
	 @IsOptional()
	 	numDownVotes: number
	// //
	@Column()
		traderEmail: string

	@Column()
		traderName: string

	 @ManyToOne(() => Trader)
	 @JoinColumn({ name: 'traderEmail', referencedColumnName: 'email' })
	 	traderE: Trader

	@ManyToOne(() => Trader)
	@JoinColumn({ name: 'traderName', referencedColumnName: 'name' })
		traderN: Trader


}
