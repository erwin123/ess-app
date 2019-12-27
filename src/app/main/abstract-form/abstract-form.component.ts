import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';
import { LyTheme2 } from '@alyle/ui';
const thmstyles = ({
  photoProfile: {
    height: '100px',
    background: "url('../../assets/img/bg-profile.jpg') no-repeat",
    borderBottom: "3px solid #fff",
    backgroundSize: 'cover'
  },
  errMsg: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
    textAlign: 'center'
  },
  button: {
    width: '48%',
    margin: '0 1% 0 1%'
  },
  labelAfter: {
    paddingBefore: '8px'
  },
  iconLarge: {
    fontSize: '20px'
  },
});
@Component({
  selector: 'app-abstract-form',
  templateUrl: './abstract-form.component.html',
  styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent implements OnInit {
  genForm: FormGroup;
  @Input('fields') fields;
  @Input('mode') mode; //0 insert, 1 edit, 2 view
  @Input('data') data;
  pickDate = [];
  pickDateModel = "";
  @Output('onSubmit') onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  readonly classes = this.theme.addStyleSheet(thmstyles);
  constructor(private theme: LyTheme2, private stateService: StateService) { }

  ngOnInit() {
    this.genForm = this.stateService.toFormGroup(this.fields);
    if (this.data)
    {
      //this.stateService.resetForm(this.genForm, this.data);
      setTimeout(() => { this.stateService.resetForm(this.genForm, this.data); }, 0);
    }
    if (this.mode == 2) {
      this.genForm.disable();
    }
    this.genForm.valueChanges.subscribe(val => {
      this.onChange.emit(val)
    })
  }

  // ngAfterViewInit() {
   
  // }

  clickPickedDate(key) {
    this.pickDate[key] = true;
  }

  formSubmit() {
    if (this.genForm.valid)
      this.onSubmit.emit(this.genForm);
  }

  handleDate(event, key) {
    this.pickDate[key] = false;
    this.genForm.get(key).setValue(event.format("YYYY-MM-DD"));
  }

}
