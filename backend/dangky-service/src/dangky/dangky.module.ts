import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DangkyController } from './dangky.controller.js';
import { DangkyService } from './dangky.service.js';
import { DangKy } from './entities/dangky.entity.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([DangKy]),
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        secret: c.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [DangkyController],
  providers: [DangkyService, JwtAuthGuard, RolesGuard],
  exports: [DangkyService],
})
export class DangkyModule {}