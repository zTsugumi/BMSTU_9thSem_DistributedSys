import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPerson } from '../interfaces/person.interface';

/**
 * Entity defines the model to hold database table
 *
 * @class
 */
@Entity({ name: 'persons' })
export class Person extends BaseEntity implements IPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 80 })
  name: string;

  @Column({ default: null })
  age: number;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  work: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
