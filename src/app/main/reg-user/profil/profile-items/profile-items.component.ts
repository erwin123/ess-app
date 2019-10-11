import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    padding: '15px 0px 0px 10px'
  },
  button: {
    width: '100%',
    marginBottom: '25px',
    marginTop:'50px'
  }
});
@Component({
  selector: 'app-profile-items',
  templateUrl: './profile-items.component.html',
  styleUrls: ['./profile-items.component.scss']
})
export class ProfileItemsComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  title="";
  columns = [];
  data = [];
  dataTemp = [];
  fields = [];
  parser;
  addRow = false;
  constructor(@Inject(LY_DIALOG_DATA) public dataParser: any, public dialog: LyDialogRef, private theme: LyTheme2) {
    this.parser = dataParser;
  }

  ngOnInit() {
    this.title = this.parser.objectData;
    this.data = this.parser.data;
    this.dataTemp = this.parser.dataTemp;
    this.columns = this.parser.col;
    this.fields = this.parser.fieldInput;
  }

  addedRow($event){
    if($event){
      this.addRow = false;
      this.dataTemp.push($event);
    }
  }

  closeDialog(){
    this.dialog.close(this.dataTemp);
  }
}
