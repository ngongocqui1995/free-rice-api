import { PartialType } from '@nestjs/swagger';
import { CreateValidAddressDto } from './create-valid-address.dto';

export class UpdateValidAddressDto extends PartialType(CreateValidAddressDto) {}
