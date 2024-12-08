import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { AuthJwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthLocalStrategy } from './strategies/local.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '48h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthLocalStrategy, AuthJwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
