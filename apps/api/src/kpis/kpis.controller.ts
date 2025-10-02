import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('KPIs')
@Controller('kpis')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Create a new KPI record' })
  create(@Body() createKpiDto: CreateKpiDto) {
    return this.kpisService.create(createKpiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPIs' })
  findAll() {
    return this.kpisService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get KPIs by user ID' })
  findByUser(@Param('userId') userId: string) {
    return this.kpisService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get KPI by ID' })
  findOne(@Param('id') id: string) {
    return this.kpisService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Update a KPI' })
  update(@Param('id') id: string, @Body() updateKpiDto: UpdateKpiDto) {
    return this.kpisService.update(id, updateKpiDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a KPI (Admin only)' })
  remove(@Param('id') id: string) {
    return this.kpisService.remove(id);
  }
}
