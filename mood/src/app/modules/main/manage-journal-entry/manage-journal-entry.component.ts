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

  combineDateWithTime(date: Date, time: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  }

  submitCustomMood() {
    this.presetMoods.push(this.customPresetMood);
    this.journalEntry.mood = this.customPresetMood;

    this.customPresetMood = '';
    this.showAddPresetMoodInput = false;
  }

  async submit() {
    await this.handleSubmit(
      async () => {
        // assign a timestamp if creating a new entry
        if (!this.journalEntry.uid) {
          this.journalEntry.entryAt = this.combineDateWithTime(
            new Date(this.date),
            new Date()
          );
        }

        await this.journalEntryService.save(this.journalEntry);
        await this.baseService.router.navigateByUrl('/calendar');
      },
      { disableLoadingEmits: true, successMessage: 'Successfully saved entry!' }
    );
  }
}
