import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldModel } from '../../models/form-field.model';
import { FieldSet } from '../field-list/field-list.component';

@Component({
  selector: 'app-numeric-input',
  styleUrls: ['numeric-input.component.scss'],
  templateUrl: 'numeric-input.component.html'
})

export class NumericInputComponent implements OnInit {

  @Input() data: FieldSet;
  @Input() inputForm: FormGroup;
  @Input() disable: Boolean = false;
  @Input() hideLabel = false;
  @Input() isTable = false;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (!this.isTable) {
      const group = {};
      const validations = this.setValidaitons();
      group[this.data.fieldName] = validations.length ? new FormControl('', validations) : new FormControl('');
      const form = this.inputForm.get(this.data.fieldName);
      if (form && (this.data.fieldType === 'N')) {
        this.inputForm.get(this.data.fieldName).setValue(this.data['fieldValue'].toString() || '');
      } else {
        const control = this.fb.control(this.data['fieldValue'].toString() || '', [Validators.required]);
        this.inputForm.addControl(this.data.fieldName, control);
      }
    }
  }

  onChange() {
    if (!this.isTable) {
      this.data.fieldValue = this.inputForm.get(this.data.fieldName).value;
    }
  }

  setValidaitons() {
    const validations = [];
    if (this.data.required) {
      validations.push(Validators.required);
    }
    if (this.data.validations) {
      const validationRules = this.data.validations;
      if (validationRules.minLength) {
        validations.push(Validators.minLength(validationRules.minLength));
      }
      if (validationRules.maxLength) {
        validations.push(Validators.minLength(validationRules.maxLength));
      }
      if (validationRules.pattern) {
        validations.push(Validators.pattern(validationRules.pattern));
      }
    }
    return validations;
  }

  isFieldValid(field: string) {
    if (!this.isTable) {
      return !this.inputForm.get(field).disabled && !this.inputForm.get(field).valid && this.inputForm.get(field).touched;
    }
    return false;
  }

  displayError(field: string) {
    return {
      'has-error': !this.inputForm.get(field).valid
    };
  }

  displayFieldCss(field: string) {
    return {
      'error': true
    };
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  convertDisplayName(displayName: string) {
    return displayName.substring(0, 35);
  }
}
