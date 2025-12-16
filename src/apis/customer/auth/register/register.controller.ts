import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterService } from './register.service';
import { ApiRegister } from './swagger/register.swagger';
import { LoggerService } from '@logger';

@Controller(ROUTER_ENUM.REGISTER)
@ApiTags(ROUTER_TAG_ENUM.REGISTER)
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loggerService: LoggerService,
  ) { }
  private context = RegisterController.name;

  @Post()
  @ApiRegister()
  @HttpCode(HTTP_STATUS_ENUM.CREATED)
  async create(@Body() createRegisterDto: CreateRegisterDto) {
    this.loggerService.log(this.context, 'create', createRegisterDto);
    try {
      const customer = await this.registerService.create(createRegisterDto);
        console.log("🚀 🇵 🇭: ~ customer:", customer)
        // Loại bỏ password
        // const { password, ...safeCustomerData } = customer.data;
        // CHỈ TRẢ VỀ ĐỐI TƯỢNG DATA THUẦN TÚY (Plain Object)
        return customer.data;
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
      throw error;
    }
  }

  // @Get()
  // findAll() {
  //   return this.registerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.registerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
  //   return this.registerService.update(+id, updateRegisterDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.registerService.remove(+id);
  // }
}
