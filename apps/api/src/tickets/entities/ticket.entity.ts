import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tickets')
export class Ticket {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty({ enum: TicketStatus })
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @ApiProperty({ enum: TicketPriority })
  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @ApiProperty()
  @Column({ nullable: true })
  category: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => User, (user) => user.createdTickets)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty()
  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @ApiProperty()
  @Column({ nullable: true })
  assignedToId: string;

  @ApiProperty()
  @Column({ type: 'int', default: 240 }) // Default 4 hours in minutes
  slaMinutes: number;

  @ApiProperty()
  @Column({ type: 'int', default: 75 }) // Default 75% warning threshold
  slaWarningPercent: number;

  @ApiProperty()
  get slaStatus(): 'GREEN' | 'YELLOW' | 'RED' {
    if (this.status === TicketStatus.RESOLVED || this.status === TicketStatus.CLOSED) {
      return 'GREEN';
    }

    const now = new Date();
    const elapsedMinutes = Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60));
    const warningThreshold = (this.slaMinutes * this.slaWarningPercent) / 100;

    if (elapsedMinutes >= this.slaMinutes) {
      return 'RED';
    } else if (elapsedMinutes >= warningThreshold) {
      return 'YELLOW';
    } else {
      return 'GREEN';
    }
  }

  @ApiProperty()
  get slaTimeRemaining(): number {
    if (this.status === TicketStatus.RESOLVED || this.status === TicketStatus.CLOSED) {
      return 0;
    }

    const now = new Date();
    const elapsedMinutes = Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60));
    return Math.max(0, this.slaMinutes - elapsedMinutes);
  }
}
