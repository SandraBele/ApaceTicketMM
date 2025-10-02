import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Team } from '../../teams/entities/team.entity';

export enum UserRole {
  ADMIN = 'admin',
  TECH_SUPPORT = 'tech_support',
  BUSINESS_DEV = 'business_dev',
  MANAGEMENT = 'management',
  PRODUCT_DEV = 'product_dev',
}

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TECH_SUPPORT,
  })
  role: UserRole;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  country: string;

  @ApiProperty()
  @Column({ nullable: true })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.members, { nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ApiProperty()
  @Column({ default: 0 })
  failedLoginAttempts: number;

  @ApiProperty()
  @Column({ default: false })
  isLocked: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  lastLoginAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  createdTickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  assignedTickets: Ticket[];

  @ApiProperty()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
