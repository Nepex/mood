import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QueryModule } from './query/query.module';
import { UserModule } from './user/user.module';
import { UserRolesModule } from './user-roles/user-roles.module';

@Module({
  imports: [
    AuthModule,
    QueryModule,
    UserModule,
    UserRolesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      // password: 'root',
      database: 'mood',
      entities: ['dist/**/*.entity{.ts,.js}'],
      // synchronize: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
