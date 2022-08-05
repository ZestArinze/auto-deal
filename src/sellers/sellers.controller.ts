import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { GetSellersDto } from './dto/get-sellers.dto';
import { checkAbility } from '../casl/casl.utils';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Action } from '../auth/enums/permission.action';
import { Seller } from './entities/seller.entity';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createSellerDto: CreateSellerDto) {
    checkAbility(this.abilityFactory, user, Action.Manage, Seller);

    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findMany(@CurrentUser() user: User, @Body() dto: GetSellersDto) {
    checkAbility(this.abilityFactory, user, Action.Manage, Seller);

    return this.sellersService.findMany(dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    checkAbility(this.abilityFactory, user, Action.ManageOwn, Seller);

    return this.sellersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    checkAbility(this.abilityFactory, user, Action.Manage, Seller);

    return this.sellersService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    checkAbility(this.abilityFactory, user, Action.Manage, Seller);

    return this.sellersService.remove(+id);
  }
}
