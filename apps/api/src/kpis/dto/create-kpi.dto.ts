import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKpiDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  month: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ticketsResolved?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ticketsCreated?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  avgResolutionTimeHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  opportunitiesCreated?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  opportunityValue?: number;
}
