import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldModel } from '../../models/form-field.model';

@Component({
  selector: 'app-textarea',
  styleUrls: ['textarea.component.scss'],
  templateUrl: 'textarea.component.html'
})

export class TextAreaComponent implements OnInit, OnChanges {

  @Input() data: FormFieldModel;
  @Input() panel: string;
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
      if (form) {
      } else {
        const control = this.fb.control('', [Validators.required]);
        this.inputForm.addControl(this.data.fieldName, control);
      }
      this.ngOnChanges();
    }
  }

  ngOnChanges() {
    if (!this.isTable) {
      const control = this.inputForm.get(this.data.fieldName);
      if (control) {
        if (this.disable) {
          control.setValue('');
          control.disable();
        } else {
          control.setValue(this.data.displayName);
          control.enable();
        }
      }
    }
  }

  onChange() {
    if (!this.isTable) {
      this.data.displayName = this.inputForm.get(this.data.fieldName).value;
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

  setInputProperties() {
    if (this.data.value) {
      this.inputForm.get(this.data.fieldName).setValue(this.data.value);
    }
    if (this.data.disabled) {
      this.inputForm.get(this.data.fieldName).disable();
    }
  }

  isFieldValid(field: string) {
    return !this.inputForm.get(field).disabled && !this.inputForm.get(field).valid && this.inputForm.get(field).touched;
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
}
