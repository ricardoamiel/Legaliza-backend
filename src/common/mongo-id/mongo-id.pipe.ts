import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (metadata.type !== 'param') {
      throw new BadRequestException(
        `El tipo de argumento ${metadata.type} no es soportado.`,
      );
    }
    if (!isMongoId(value)) {
      throw new BadRequestException('El ID proporcionado no es válido.');
    }

    return value;
  }
}
