import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JournalEntryController } from './journal-entry.controller';
import { JournalEntryEntity } from './journal-entry.entity';
import { JournalEntryService } from './journal-entry.service';
import { QueryModule } from '../query/query.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalEntryEntity]),
    forwardRef(() => QueryModule),
  ],
  controllers: [JournalEntryController],
  providers: [JournalEntryService],
  exports: [JournalEntryService],
})
export class JournalEntryModule {}
