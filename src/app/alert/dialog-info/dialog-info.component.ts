import { Component, OnInit,Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  button: {
    width:'40%',
    margin:'5px'
  }
});
@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {
  title = "Informasi";
  confirmationMode = false;
  classes = this._theme.addStyleSheet(styles);
  constructor(@Inject(LY_DIALOG_DATA) public data: any,public dialogRefInfo: LyDialogRef,private _theme: LyTheme2) {  }

  ngOnInit() {
    if(this.data.MessageTitle){
      this.title = this.data.MessageTitle;
    }
    if(this.data.ConfirmationMode){
      this.confirmationMode = this.data.ConfirmationMode;
    }
  }

}
