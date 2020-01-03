import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCardModule } from '@alyle/ui/card';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyTypographyModule } from '@alyle/ui/typography';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LyGridModule } from '@alyle/ui/grid';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LySnackBarModule } from '@alyle/ui/snack-bar';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyListModule } from '@alyle/ui/list';
import { LyBadgeModule } from '@alyle/ui/badge';
import { DialogInfoComponent } from '../alert/dialog-info/dialog-info.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'ngx-easy-table';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TextvalPipe } from '../pipe/textval.pipe';
import { CheckLocationComponent } from '../main/location/check-location/check-location.component';
import { AbstractFormComponent } from '../main/abstract-form/abstract-form.component';
import { MaintainTplComponent } from '../main/maintain-tpl/maintain-tpl.component';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { DialogForgot } from '../login/login.component';
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'YYYY-MM-DD',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [DialogInfoComponent,DialogForgot,
    TextvalPipe,
    CheckLocationComponent,
    AbstractFormComponent,
    MaintainTplComponent],
  imports: [
    CommonModule,
    LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyAvatarModule,
    LyIconModule,
    LyMenuModule,
    LyTypographyModule,
    LyCardModule,
    LyGridModule,
    LyFieldModule,
    ReactiveFormsModule,
    FormsModule,
    LySelectModule,
    LyDialogModule,
    LySnackBarModule,
    LyRadioModule,
    LyCheckboxModule,
    TableModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    LyCarouselModule,
    LyListModule,
    LyBadgeModule
  ],
  exports: [LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyIconModule,
    LyAvatarModule,
    LyMenuModule,
    LyTypographyModule,
    FormsModule,
    LyCardModule,
    LyGridModule,
    LyFieldModule,
    ReactiveFormsModule,
    LySelectModule,
    LyDialogModule,
    LySnackBarModule,
    LyRadioModule,
    LyCheckboxModule,
    DialogInfoComponent,
    CheckLocationComponent,
    AbstractFormComponent,
    MaintainTplComponent,
    TableModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    TextvalPipe,
    LyCarouselModule,
    LyListModule,
    LyBadgeModule,
    DialogForgot
  ],
  entryComponents: [DialogInfoComponent, DialogForgot],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }
  ],
})

export class SharingModuleModule { }
