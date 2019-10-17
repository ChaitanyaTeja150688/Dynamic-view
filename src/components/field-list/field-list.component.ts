import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'underscore';
import { Panel } from 'src/interfaces/panel.interface';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';

export interface FieldSet {
  hidden: boolean;
  required: boolean;
  sectionSapName: string;
  optional: boolean;
  displayName: string;
  userRole: string;
  fieldName: string;
  fieldValue: string;
  selected: boolean;
  dataType: string;
  fieldType: string;
  length: string;
  sequence: string;
  configSave: string;
  refField: string;
  mandatory: boolean;
  validations: any;
}

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss']
})
export class FieldListComponent implements OnInit, OnChanges {
  @Input() fieldList: FieldSet[] = [];
  @Input() form: FormGroup;
  @Input() hiddenRequired = true;
  @ViewChild(ToggleSwitchComponent) toggleSwitchComponent: ToggleSwitchComponent;
  constructor(
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.fieldList.length) {
      this.buildFormGroup();
    }
  }

  ngOnChanges() { }

  buildFormGroup() {
    _.forEach(this.fieldList, (fieldSet: FieldSet) => {
      const fieldControl = this.getFormControl(fieldSet.fieldName);
      if (fieldControl) {
        fieldControl.setValue(fieldSet.displayName);
      } else {
        const control = this.formBuilder.control(fieldSet.displayName, [Validators.required]);
        this.form.addControl(fieldSet.fieldName, control);
      }
      if (fieldSet.hidden) {
        this.form.get(fieldSet.fieldName).disable();
      }
    });
  }

  getFormControl(fieldName: string): AbstractControl {
    return <FormGroup>this.form.controls[fieldName];
  }

  toggleChange(event: FieldSet, index, isHidden = false) {
    if (!event.required) {
      if (isHidden) {
        event.hidden = !event.hidden;
        this.updateInputControl(event);
      } else {
        event.optional = !event.optional;
      }
      this.fieldList[index] = event;
    }
    this.updateValidations(event);
    this.validateDependentFields(event);
  }

  updateInputControl(event: FieldSet) {
    const inputControl = this.getFormControl(event.fieldName);
    if (event.hidden) {
      inputControl.disable();
      event.optional = false;
    } else {
      inputControl.enable();
    }
  }

  validateDependentFields(field: FieldSet) {
    const fieldSetList = this.fieldList;
    if (field.refField) {
      const dependentFields = _.where(fieldSetList, { refField: field.refField});
      if (dependentFields.length > 0) {
        let isHidden = false;
        let isMandatory = false;
        let count = 0;
        dependentFields.forEach((item: FieldSet) => {
          if (item.hidden) {
            count = count + 1;
          }
          if (item.required || item.optional) {
            isMandatory = true;
          }
        });
        if ((count === dependentFields.length)) {
          isHidden = true;
        }
        if (dependentFields.length > 0) {
          fieldSetList.forEach((fields: FieldSet) => {
            if (field.refField === fields.fieldName) {
              fields.hidden = isHidden;
              if (fields.hidden) {
                fields.optional = false;
              } else {
                fields.optional = isMandatory;
              }
              this.updateInputControl(fields);
              this.toggleSwitchComponent.emitEvent(fields.fieldName, fields.hidden, fields.optional);
            }
          });
        }
      }
    }
  }

  onChange(event: FieldSet, index) {
    event.displayName = this.getFormControl(event.fieldName).value;
  }

  updateValidations(fieldSet: FieldSet) {
    const control = this.getFormControl(fieldSet.fieldName);
    control.setValidators(fieldSet.optional ? [Validators.required] : null);
    control.updateValueAndValidity();
  }

  isFormControlValid(fieldName: string) {
    const control = this.getFormControl(fieldName);
    return control ? (control.touched && control.invalid) : false;
  }

  setDependency(fieldSet: FieldSet) {
    if (fieldSet.refField) {
    }
  }

}
