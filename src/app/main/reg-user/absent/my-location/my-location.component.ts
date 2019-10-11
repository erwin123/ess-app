import { Component, OnInit, Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-my-location',
  templateUrl: './my-location.component.html',
  styleUrls: ['./my-location.component.scss']
})
export class MyLocationComponent implements OnInit {
  constructor(@Inject(LY_DIALOG_DATA) public data: any,
    public dialogMap: LyDialogRef, public stateService: StateService) { }

  ngOnInit() {
  }

}
