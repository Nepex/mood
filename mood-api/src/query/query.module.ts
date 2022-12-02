import { Module } from '@nestjs/common';

import { QueryService } from './query.service';

@Module({
  imports: [],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}
