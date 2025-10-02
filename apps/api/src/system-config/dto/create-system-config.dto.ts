import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigKey } from '../entities/system-config.entity';

export class CreateSystemConfigDto {
  @ApiProperty({ enum: ConfigKey })
  @IsEnum(ConfigKey)
  key: ConfigKey;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;
}
