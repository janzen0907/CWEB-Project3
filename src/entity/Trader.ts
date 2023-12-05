import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsNotEmpty, IsOptional, length, Length} from "class-validator";


@Entity()
export class Trader{
    @PrimaryGeneratedColumn('increment')
    @IsOptional()
        id: number

    @Column('varchar')
    @IsEmail({}, {message: "Email must be in proper format "})
    @IsNotEmpty({message: "Email is required"})
        email: string

    @Column('varchar', {length: 300})
    @Length(1, 300, {message: 'Name must be between $Constraint1 and $Constraint2 charecters'})
    @IsNotEmpty({message: "Name is required"})
        name: string

    @Column('int')
    @IsOptional()
        rating: number

    @Column('int')
    @IsOptional()
        ratingCount: number

}
