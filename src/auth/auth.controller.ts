import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
} from '@nestjs/common';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    this.logger.log('Регистрация нового пользователя:', dto.login);
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      this.logger.warn('Пользователь уже зарегистрирован:', dto.login);
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    this.logger.log('Попытка входа:', login);
    const user = await this.authService.validateUser(login, password);
    this.logger.log('Пользователь успешно вошёл:', user.email);
    return this.authService.login(user.email);
  }
}
