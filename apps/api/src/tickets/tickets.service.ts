import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ticket, TicketStatus, TicketPriority } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

interface TicketFilters {
  status?: string;
  priority?: string;
  assignedToId?: string;
  createdById?: string;
  teamId?: string;
  country?: string;
  slaStatus?: 'GREEN' | 'YELLOW' | 'RED';
  category?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketsRepository.create(createTicketDto);
    return this.ticketsRepository.save(ticket);
  }

  async findAll(filters?: TicketFilters, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<any[]> {
    let queryBuilder = this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.createdBy', 'createdBy')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignedTo.team', 'assignedToTeam')
      .leftJoinAndSelect('createdBy.team', 'createdByTeam');

    // Apply filters
    if (filters) {
      queryBuilder = this.applyFilters(queryBuilder, filters);
    }

    // Apply sorting
    const orderBy = sortBy || 'createdAt';
    const order = sortOrder || 'DESC';
    queryBuilder.orderBy(`ticket.${orderBy}`, order);

    const tickets = await queryBuilder.getMany();

    return tickets.map(ticket => ({
      ...ticket,
      slaStatus: this.calculateSlaStatus(ticket),
      slaTimeRemaining: this.calculateSlaTimeRemaining(ticket),
    }));
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Ticket>, filters: TicketFilters): SelectQueryBuilder<Ticket> {
    if (filters.status) {
      queryBuilder.andWhere('ticket.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority: filters.priority });
    }

    if (filters.assignedToId) {
      queryBuilder.andWhere('ticket.assignedToId = :assignedToId', { assignedToId: filters.assignedToId });
    }

    if (filters.createdById) {
      queryBuilder.andWhere('ticket.createdById = :createdById', { createdById: filters.createdById });
    }

    if (filters.teamId) {
      queryBuilder.andWhere(
        '(assignedToTeam.id = :teamId OR createdByTeam.id = :teamId)',
        { teamId: filters.teamId }
      );
    }

    if (filters.country) {
      queryBuilder.andWhere(
        '(assignedTo.country = :country OR createdBy.country = :country)',
        { country: filters.country }
      );
    }

    if (filters.category) {
      queryBuilder.andWhere('ticket.category = :category', { category: filters.category });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('ticket.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('ticket.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }

    return queryBuilder;
  }

  private calculateSlaStatus(ticket: Ticket): 'GREEN' | 'YELLOW' | 'RED' {
    if (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) {
      return 'GREEN';
    }

    const now = new Date();
    const elapsedMinutes = Math.floor((now.getTime() - ticket.createdAt.getTime()) / (1000 * 60));
    const warningThreshold = (ticket.slaMinutes * ticket.slaWarningPercent) / 100;

    if (elapsedMinutes >= ticket.slaMinutes) {
      return 'RED';
    } else if (elapsedMinutes >= warningThreshold) {
      return 'YELLOW';
    } else {
      return 'GREEN';
    }
  }

  private calculateSlaTimeRemaining(ticket: Ticket): number {
    if (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) {
      return 0;
    }

    const now = new Date();
    const elapsedMinutes = Math.floor((now.getTime() - ticket.createdAt.getTime()) / (1000 * 60));
    return Math.max(0, ticket.slaMinutes - elapsedMinutes);
  }

  async findOne(id: string): Promise<any> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo', 'createdBy.team', 'assignedTo.team'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return {
      ...ticket,
      slaStatus: this.calculateSlaStatus(ticket),
      slaTimeRemaining: this.calculateSlaTimeRemaining(ticket),
    };
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<any> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    Object.assign(ticket, updateTicketDto);
    
    if (updateTicketDto.status === TicketStatus.RESOLVED || updateTicketDto.status === TicketStatus.CLOSED) {
      ticket.resolvedAt = new Date();
    }

    await this.ticketsRepository.save(ticket);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
  }

  async assign(id: string, assignedToId: string): Promise<any> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    ticket.assignedToId = assignedToId;
    await this.ticketsRepository.save(ticket);
    return this.findOne(id);
  }

  async bulkAssign(ticketIds: string[], assignedToId: string): Promise<any[]> {
    await this.ticketsRepository
      .createQueryBuilder()
      .update(Ticket)
      .set({ assignedToId })
      .where('id IN (:...ids)', { ids: ticketIds })
      .execute();

    return Promise.all(ticketIds.map(id => this.findOne(id)));
  }

  async bulkUpdateStatus(ticketIds: string[], status: TicketStatus): Promise<any[]> {
    const updateData: any = { status };
    
    if (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) {
      updateData.resolvedAt = new Date();
    }

    await this.ticketsRepository
      .createQueryBuilder()
      .update(Ticket)
      .set(updateData)
      .where('id IN (:...ids)', { ids: ticketIds })
      .execute();

    return Promise.all(ticketIds.map(id => this.findOne(id)));
  }

  async getTicketStats(filters?: TicketFilters): Promise<any> {
    let queryBuilder = this.ticketsRepository.createQueryBuilder('ticket');
    
    if (filters) {
      queryBuilder = this.applyFilters(queryBuilder, filters);
    }

    const tickets = await queryBuilder.getMany();
    
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN).length;
    const inProgressTickets = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
    const resolvedTickets = tickets.filter(t => t.status === TicketStatus.RESOLVED).length;
    const closedTickets = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
    
    // Calculate SLA stats
    const slaStats = tickets.reduce(
      (acc, ticket) => {
        const slaStatus = this.calculateSlaStatus(ticket);
        acc[slaStatus.toLowerCase()]++;
        return acc;
      },
      { green: 0, yellow: 0, red: 0 }
    );

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      slaStats,
    };
  }

  async getTicketsByUser(userId: string): Promise<any[]> {
    return this.findAll({ assignedToId: userId });
  }

  async getTicketsByTeam(teamId: string): Promise<any[]> {
    return this.findAll({ teamId });
  }

  async getOverdueTickets(): Promise<any[]> {
    const tickets = await this.findAll();
    return tickets.filter(ticket => 
      ticket.slaStatus === 'RED' && 
      (ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS)
    );
  }

  async pauseSLA(id: string): Promise<any> {
    // This would require additional fields in the entity to track paused time
    // For now, we'll just return the ticket
    return this.findOne(id);
  }

  async resumeSLA(id: string): Promise<any> {
    // This would require additional fields in the entity to track paused time
    // For now, we'll just return the ticket
    return this.findOne(id);
  }
}
