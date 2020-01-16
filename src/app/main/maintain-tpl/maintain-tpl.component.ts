import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { API, APIDefinition } from 'ngx-easy-table';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyDialog } from '@alyle/ui/dialog';
import { UploaderComponent } from '../uploader/uploader.component';

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    padding: '15px 0px 0px 10px'
  },
  table: {
    fontSize: '14px'
  }
});
const STYLES_DIALOG = (theme: ThemeVariables) => ({
  width: '800px',
  borderRadius: 0,
  [theme.getBreakpoint('XSmall')]: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw !important',
    maxHeight: '100vh !important'
  }
});
@Component({
  selector: 'app-maintain-tpl',
  templateUrl: './maintain-tpl.component.html',
  styleUrls: ['./maintain-tpl.component.scss']
})

export class MaintainTplComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @ViewChild('table', { static: false }) table: APIDefinition;
  @ViewChild('table2', { static: false }) table2: APIDefinition;

  @Input('columns') columns = [];
  @Input('addButton') addButton = true;
  @Input('upButton') upButton = true;
  
  @Input('data') data = [];
  @Input('objectData') objectData;
  @Input('isAdvanced') isAdvanced = false;

  @Output() actionClickEvent = new EventEmitter<any>();
  @Output() actionAddEvent = new EventEmitter<number>();
  @Output() actionDeleteEvent = new EventEmitter<any>();
  public toggledRows = new Set<number>();
  constructor(private _dialog: LyDialog, private theme: LyTheme2) { }

  ngOnInit() {
  }
  onChange($event): void {
    if ($event.target.value) {
      this.table.apiEvent({
        type: API.onGlobalSearch, value: $event.target.value,
      });
    }
  }
  sendAction($event) {
    console.log($event);
    if ($event.value.row)
      this.actionClickEvent.emit($event.value.row);
  }

  sendAdd(act) {
    this.actionAddEvent.emit(act);
  }

  
    // const dialogRefInfo = this._dialog.open<UploaderComponent>(UploaderComponent, {
    //   containerClass: this.theme.style(STYLES_DIALOG),
    //   data:{}
    // });
    // dialogRefInfo.afterClosed.subscribe((res) => {

    //   console.log(res);
    // });
  
  deleteAction($event, data) {
    this.actionDeleteEvent.emit(data);
    $event.stopPropagation();
  }
}
