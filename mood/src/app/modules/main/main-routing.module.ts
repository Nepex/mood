import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@shared';
import { CalendarComponent } from './calendar/calendar.component';

import { MainComponent } from './main.component';
import { ManageJournalEntryComponent } from './manage-journal-entry/manage-journal-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
      },
      { path: 'calendar', component: CalendarComponent },
      { path: 'entry', component: ManageJournalEntryComponent },
      { path: 'entry/:uid', component: ManageJournalEntryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
