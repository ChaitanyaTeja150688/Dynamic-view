import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldModel } from '../../models/form-field.model';
import { UserDataService } from 'src/app/services/user-data.service';
import * as _ from 'underscore';
import { v } from '@angular/core/src/render3';

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss']
})
export class DropDownListComponent implements OnInit {
  @Input() data: FormFieldModel;
  @Input() panel: string;
  @Input() inputForm: FormGroup;
  @Input() disable: Boolean = false;
  @Input() hideLabel = false;
  @Input() isTable = false;
  @Input() formControl: FormControl;
  options: any = [];
  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    const group = {};
    const dropdowns = _.find(this.userDataService.dropDownList, { 'fieldName': this.data.fieldName });
    if (dropdowns) {
      this.options = dropdowns.dropdowns;
    }
    // if (!this.isTable) {
    //   const validations = this.setValidaitons();
    //   group[this.data.fieldName] = validations.length ? new FormControl('', validations) : new FormControl('');
    //   const form = this.inputForm.get(this.data.fieldName);
    //   if (form && (this.data.fieldType === 'F4' || this.data.fieldType === 'DD')) {
    //     this.inputForm.get(this.data.fieldName).setValue(this.data['fieldValue']);
    //   } else {
    //     const control = this.fb.control(this.data['fieldValue'], [Validators.required]);
    //     this.inputForm.addControl(this.data.fieldName, control);
    //   }
    // }
  }

  onChange() {
    this.data.fieldValue = this.inputForm.get(this.data.fieldName).value;
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
    if (!this.isTable) {
      return !this.inputForm.get(field).disabled && !this.inputForm.get(field).valid && this.inputForm.get(field).touched;
    }
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

  convertDisplayName(displayName: string) {
    return displayName.substring(0, 35);
  }

}
