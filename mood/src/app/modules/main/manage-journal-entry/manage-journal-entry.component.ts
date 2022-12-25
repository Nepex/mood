import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JournalEntryModel, JournalEntryService } from '@core';
import {
  BaseController,
  BaseControllerService,
  FormController,
  Logger,
} from '@shared';

const logger = new Logger('ManageJournalEntryComponent');

@Component({
  selector: 'mood-manage-journal-entry',
  templateUrl: './manage-journal-entry.component.html',
  styleUrls: ['./manage-journal-entry.component.scss'],
})
export class ManageJournalEntryComponent
  extends FormController<JournalEntryModel>
  implements OnInit
{
  date: string;
  journalEntry = new JournalEntryModel({
    mood: 'Happy',
    score: 0,
    entry: '',
  });
  editor: any;

  presetMoods = [
    'Happy',
    'Angry',
    'Sad',
    'Confused',
    'Surprised',
    'Gloomy',
    'Excited',
    'Disappointed',
    'Frustrated',
    'Scared',
    'Sleepy',
    'Content',
    'Joyful',
  ];
  hoveredScore: number | null;

  constructor(
    public baseService: BaseControllerService,
    private readonly journalEntryService: JournalEntryService,
    private readonly route: ActivatedRoute
  ) {
    super(baseService);
  }

  async ngOnInit() {
    await this.handleLoad(async () => {
      if (this.route.snapshot.params.date) {
        this.date = this.route.snapshot.params.date;
      } else if (this.route.snapshot.params.uid) {
        // editting existing entry
        this.journalEntry = await this.journalEntryService.findByUid(
          this.route.snapshot.params.uid
        );
      }
    });
  }

  onEditorCreated(e: any) {
    this.editor = e.editor;
    logger.info('onEditorCreated(): editor', this.editor);
  }
}
