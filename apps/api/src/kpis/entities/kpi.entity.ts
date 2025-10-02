import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('kpis')
export class KPI {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @Column()
  month: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  ticketsResolved: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  ticketsCreated: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  avgResolutionTimeHours: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  opportunitiesCreated: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  opportunityValue: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
