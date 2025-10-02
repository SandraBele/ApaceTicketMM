import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Ticket } from './tickets.service.mock';

interface ITicketsService {
  findAll(filters?: any): Promise<Ticket[]>;
  findOne(id: string): Promise<Ticket | undefined>;
  create(ticketData: Partial<Ticket>): Promise<Ticket>;
  update(id: string, updateData: Partial<Ticket>): Promise<Ticket | undefined>;
  delete(id: string): Promise<boolean>;
  bulkUpdate(ticketIds: string[], updateData: Partial<Ticket>): Promise<Ticket[]>;
  assign(ticketId: string, assigneeId: string, assigneeName: string, teamId?: string, teamName?: string): Promise<Ticket | undefined>;
  escalate(ticketId: string, reason: string): Promise<Ticket | undefined>;
  addNote(ticketId: string, note: string): Promise<Ticket | undefined>;
  getTicketStats(): Promise<any>;
}

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(
    @Inject('TicketsService') private readonly ticketsService: ITicketsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.ticketsService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return await this.ticketsService.getTicketStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }

  @Post()
  async create(@Body() createTicketDto: any) {
    return await this.ticketsService.create(createTicketDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTicketDto: any) {
    const ticket = await this.ticketsService.update(id, updateTicketDto);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.ticketsService.delete(id);
    if (!success) {
      throw new Error('Ticket not found');
    }
    return { message: 'Ticket deleted successfully' };
  }

  @Post('bulk-update')
  async bulkUpdate(@Body() { ticketIds, updateData }: { ticketIds: string[]; updateData: any }) {
    return await this.ticketsService.bulkUpdate(ticketIds, updateData);
  }

  @Patch(':id/assign')
  async assign(@Param('id') ticketId: string, @Body() assignmentData: any) {
    const ticket = await this.ticketsService.assign(
      ticketId,
      assignmentData.assigneeId,
      assignmentData.assigneeName,
      assignmentData.teamId,
      assignmentData.teamName
    );
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }

  @Patch(':id/escalate')
  async escalate(@Param('id') ticketId: string, @Body('reason') reason: string) {
    const ticket = await this.ticketsService.escalate(ticketId, reason);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }

  @Post(':id/notes')
  async addNote(@Param('id') ticketId: string, @Body('note') note: string) {
    const ticket = await this.ticketsService.addNote(ticketId, note);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }
}