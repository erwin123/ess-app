import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCardModule } from '@alyle/ui/card';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyListModule } from '@alyle/ui/list';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LyGridModule } from '@alyle/ui/grid';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LySnackBarModule } from '@alyle/ui/snack-bar';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { DialogInfoComponent } from '../alert/dialog-info/dialog-info.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { TableModule } from 'ngx-easy-table';

@NgModule({
  declarations: [DialogInfoComponent],
  imports: [
    CommonModule,
    LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyAvatarModule,
    LyResizingCroppingImageModule,
    LyIconModule,
    LyListModule,
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
    OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  exports: [LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyResizingCroppingImageModule,
    LyIconModule,
    LyAvatarModule,
    LyListModule,
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
    TableModule,
    OwlDateTimeModule, OwlNativeDateTimeModule
    ],
    entryComponents:[DialogInfoComponent]
})

export class SharingModuleModule { }
