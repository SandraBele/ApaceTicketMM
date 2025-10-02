import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('teams')
export class Team {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  defaultTicketsResolvedKPI: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  defaultTicketsCreatedKPI: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  defaultAvgResolutionTimeKPI: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  defaultOpportunitiesKPI: number;

  @ApiProperty()
  @Column({ type: 'float', default: 4.0 })
  defaultSLAHours: number;

  @ApiProperty()
  @Column({ default: 'UTC' })
  timezone: string;

  @ApiProperty()
  @Column({ default: '09:00' })
  workingHoursStart: string;

  @ApiProperty()
  @Column({ default: '17:00' })
  workingHoursEnd: string;

  @OneToMany(() => User, user => user.team)
  members: User[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
