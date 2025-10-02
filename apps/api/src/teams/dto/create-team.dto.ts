import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultTicketsResolvedKPI?: number = 0;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultTicketsCreatedKPI?: number = 0;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultAvgResolutionTimeKPI?: number = 0;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultOpportunitiesKPI?: number = 0;

  @ApiProperty({ required: false, default: 4.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultSLAHours?: number = 4.0;

  @ApiProperty({ required: false, default: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string = 'UTC';

  @ApiProperty({ required: false, default: '09:00' })
  @IsOptional()
  @IsString()
  workingHoursStart?: string = '09:00';

  @ApiProperty({ required: false, default: '17:00' })
  @IsOptional()
  @IsString()
  workingHoursEnd?: string = '17:00';
}
