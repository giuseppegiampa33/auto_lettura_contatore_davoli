import { IsString, IsInt, IsOptional, IsEnum, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UsageType } from '../submission.entity';

export class CreateSubmissionDto {
    @IsString()
    @IsNotEmpty()
    matricola: string;

    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    cognome: string;

    @IsString()
    @IsNotEmpty()
    indirizzo: string;

    @IsEnum(UsageType)
    uso: UsageType;

    @IsDateString()
    data_lettura: string;

    @Type(() => Number)
    @IsInt()
    lettura_annuale: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    lettura_precedente: number;

    @IsString()
    @IsNotEmpty()
    codice_fiscale: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsOptional()
    @IsEmail()
    email: string;

    // The photo defaults to empty here, handled by controller upload
    @IsOptional()
    @IsString()
    foto_url: string;
}
