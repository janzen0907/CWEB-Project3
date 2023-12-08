import {Column, Entity, JoinColumn, OneToOne} from 'typeorm'
import {Car} from './Car'
@Entity()
export class CarLookup {
    @Column()
    	carID: number

    @Column()
    	carMake: string

    @Column()
    	carModel: string

    @Column()
    	carYear: number

    @OneToOne(() => Car)
    @JoinColumn({name: 'carID', referencedColumnName: 'id'})
    	id: Car

    @OneToOne(() => Car)
    @JoinColumn({name: 'carMake', referencedColumnName: 'make'})
    	make: Car

    @OneToOne(() => Car)
    @JoinColumn({name: 'carModel', referencedColumnName: 'model'})
    	model: Car

    @OneToOne(() => Car)
    @JoinColumn({name: 'carDescription', referencedColumnName: 'year'})
    	year: Car
}