import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Action } from '../auth/enums/permission.action';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { checkAbility } from '../casl/casl.utils';
import { User } from '../users/entities/user.entity';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateCarDto) {
    checkAbility(this.abilityFactory, user, Action.Manage, Car);

    return this.carsService.create(dto);
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
