import { Component, OnInit, Input } from '@angular/core';
import { FieldSet } from '../field-list/field-list.component';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-component-panel',
  templateUrl: './component-panel.component.html',
  styleUrls: ['./component-panel.component.scss']
})
export class ComponentPanelComponent implements OnInit {
  @Input() fieldList: FieldSet[] = [];
  @Input() form: FormGroup;
  @Input() answers = {};
  @Input() isAccordion = false;
  @Input() isAdmin: Boolean = true;
  @Input() isTable: false;
  @Input() hideLabel = false;
  constructor(
    public formBuilder: FormBuilder,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.fieldList = _.where(this.fieldList, { hidden: false });
    if (this.fieldList.length) {
      this.buildFormGroup();
    }
  }

  buildFormGroup() {
    if (!this.isTable) {
      _.forEach(this.fieldList, (fieldSet: FieldSet) => {
        const form = this.form.get(fieldSet.fieldName);
        if (form) {
        } else {
          const control = this.formBuilder.control(
            this.getControlValue(fieldSet.fieldName), fieldSet.required ? [Validators.required] : null);
          this.form.addControl(fieldSet.fieldName, control);
        }
      });
    }
  }

  getControlValue(fieldName: string) {
    if (this.answers) {
      const keys = Object.keys(this.answers);
      if (keys.length) {
        return this.answers[fieldName] ? this.answers[fieldName] : null;
      }
    }
    return null;
  }

  getMasterValeus(element) {
    const filteredArray = _.find(this.userDataService.dropDownList, { 'fieldName': element.fieldName });
    return filteredArray ? filteredArray.dropdowns : [];
  }

}
