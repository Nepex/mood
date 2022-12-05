import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JournalDaySettingsController } from './journal-day-settings.controller';
import { JournalDaySettingsEntity } from './journal-day-settings.entity';
import { JournalDaySettingsService } from './journal-day-settings.service';
import { QueryModule } from '../query/query.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalDaySettingsEntity]),
    forwardRef(() => QueryModule),
  ],
  controllers: [JournalDaySettingsController],
  providers: [JournalDaySettingsService],
  exports: [JournalDaySettingsService],
})
export class JournalDaySettingsModule {}
