import { PartialType } from '@nestjs/swagger';
import { CreateCartaNotarialDto } from './create-carta_notarial.dto';

export class UpdateCartaNotarialDto extends PartialType(CreateCartaNotarialDto) {}