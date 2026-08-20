import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
