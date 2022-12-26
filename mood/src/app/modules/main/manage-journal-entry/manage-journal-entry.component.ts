import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JournalEntryModel, JournalEntryService } from '@core';
import {
  BaseController,
  BaseControllerService,
  FormController,
  Logger,
} from '@shared';
import * as dayjs from 'dayjs';

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
    mood: '',
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
  showAddPresetMoodInput = false;
  customPresetMood = '';
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
  }

  dateWithCurrentTime(): Date {
    const currentDate = new Date();
    const dateString = `${dayjs(this.date).format('ddd, DD MMM YYYY')} ${dayjs(
      currentDate
    ).format('HH:mm:ss')} UTC`;

    return new Date(dateString);
  }

  submitCustomMood() {
    if (!this.customPresetMood.trim()) return;
    this.presetMoods.push(this.customPresetMood.trim());
    this.journalEntry.mood = this.customPresetMood.trim();

    this.customPresetMood = '';
    this.showAddPresetMoodInput = false;
  }

  async submit() {
    await this.handleSubmit(
      async () => {
        // assign a timestamp if creating a new entry
        if (!this.journalEntry.uid) {
          this.journalEntry.entryAt = this.dateWithCurrentTime();
        }

        await this.journalEntryService.save(this.journalEntry);
        await this.baseService.router.navigateByUrl('/calendar');
      },
      {
        disableGlobalLoad: true,
        successMessage: `Successfully ${
          this.journalEntry.uid ? 'updated' : 'created'
        } journal entry!`,
      }
    );
  }
}
