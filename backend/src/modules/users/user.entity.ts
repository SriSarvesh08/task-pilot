import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserType {
  GUEST = 'guest',
  REGISTERED = 'registered',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({
    type: 'varchar',
    enum: UserType,
    default: UserType.GUEST,
  })
  type: UserType;

  @CreateDateColumn()
  createdAt: Date;
}
