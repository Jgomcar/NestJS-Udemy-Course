import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // otra forma de convertir el queryparam en number
    limit?: number;

    @IsOptional()
    @Type( () => Number )
    @Min(0)
    offset?: number;
}