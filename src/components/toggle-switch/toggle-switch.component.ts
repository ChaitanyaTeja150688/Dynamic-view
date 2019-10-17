import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormFieldModel } from 'src/models/form-field.model';
import { Panel } from 'src/interfaces/panel.interface';
import { FieldSet } from '../field-list/field-list.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit, OnChanges {
  @Input() label = 'Label';
  @Input() fieldName: string;
  @Input() type = '';
  @Input() data: FieldSet;
  @Input() panel: Panel;
  @Input() disable: Boolean = false;
  @Output() toggleChange = new EventEmitter<FormFieldModel>();
  @Output() togglePanelChange = new EventEmitter<Panel>();
  @Input() form: FormGroup;
  selected = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!this.type) {
      this.selected = this.data[this.fieldName];
      this.buildForm(this.data.fieldName);
    } else {
      this.selected = this.panel[this.fieldName];
    }
    this.ngOnChanges();
  }

  buildForm(controlName) {
    if (!this.getFormControl(controlName, this.fieldName)) {
      const control = this.formBuilder.control({ value: this.data[this.fieldName], disabled: this.data.hidden });
      this.form.addControl(controlName + '_' + this.fieldName, control);
    } else {
      this.getFormControl(controlName, this.fieldName).setValue(this.data[this.fieldName]);
    }
    if (this.data.hidden || this.data.required) {
      this.getFormControl(controlName, this.fieldName).disable();
    }
  }

  getFormControl(fieldName: string, fieldType: string, isPanel: string = '') {
    return this.form.get(fieldName + '_' + fieldType);
  }

  getFormControlName() {
    return this.data.fieldName + '_' + this.fieldName;
  }

  ngOnChanges() {
    if (!this.type) {
      this.selected = this.data[this.fieldName];
      if (this.getFormControl(this.data.fieldName, this.fieldName)) {
        if (this.disable) {
          this.getFormControl(this.data.fieldName, this.fieldName).disable();
        } else {
          this.getFormControl(this.data.fieldName, this.fieldName).enable();
        }
      }
    }
  }

  onChange() {
    if (!this.disable) {
      if (!this.getFormControl(this.data.fieldName, 'hidden').value && this.fieldName === 'optional') {
        this.updateToggle();
      } else if (this.fieldName === 'hidden' || this.type) {
        this.updateToggle();
      }
    }
  }

  updateToggle() {
    this.selected = !this.selected;
    if (!this.type) {
      this.toggleChange.emit(this.data);
    } else {
      this.panel[this.fieldName] = this.selected;
      if (this.fieldName === 'collapsable' && !this.selected) {
        this.panel['collapsed'] = true;
      }
      this.togglePanelChange.emit(this.panel);
    }
  }

  emitEvent(controlName, hidden, mandatory) {
    this.getFormControl(controlName, 'hidden').setValue(hidden);
    this.getFormControl(controlName, 'optional').setValue(mandatory);
    if (this.data.hidden || this.data.required) {
      this.getFormControl(controlName, this.fieldName).disable();
    }
  }

  isDisbale() {
    return this.getFormControl(this.data.fieldName, 'hidden').value === true ? true : false;
  }

}
