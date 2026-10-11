import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DetaiController } from './detai.controller.js';
import { DetaiService } from './detai.service.js';
import { Detai } from './entities/detai.entity.js';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Detai]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [DetaiController],
  providers: [
    DetaiService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [DetaiService],
})
export class DetaiModule {}