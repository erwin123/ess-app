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

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
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
    LyCheckboxModule
  ],
  exports: [LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyResizingCroppingImageModule,
    LyIconModule,
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
    LyCheckboxModule]
})

export class SharingModuleModule { }
