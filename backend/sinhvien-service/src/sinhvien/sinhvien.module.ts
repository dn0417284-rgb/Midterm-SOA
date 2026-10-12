import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SinhvienController } from './sinhvien.controller.js';
import { SinhvienService } from './sinhvien.service.js';
import { SinhVien } from './entities/sinhvien.entity.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([SinhVien]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [SinhvienController],

  providers: [
    SinhvienService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class SinhvienModule {}