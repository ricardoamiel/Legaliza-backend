import { PartialType } from '@nestjs/mapped-types';
import { CreateConstDomiciliariaDto } from './create-constDomiciliaria';

export class UpdateConstDomiciliariaDto extends PartialType(
    CreateConstDomiciliariaDto,
) {}