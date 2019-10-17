import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Panel, Tab, TableRow } from '../../interfaces/panel.interface';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'underscore';
import { FieldSet } from '../field-list/field-list.component';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  @Input() panels: Array<Panel>;
  @Input() isAdmin: Boolean = true;
  @Input() form: FormGroup;
  @Input() answers = {};
  @Output() deletePanel = new EventEmitter<Panel>();
  @Input() appFieldDependentList;
  isSectionDependent = false;
  dependentSectionDetails;
  confirmationModal = false;
  deleteSection: Panel;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.buildFormGroup();
  }

  buildFormGroup() {
    const formGroup = this.commonService.getFormGroup({});
    this.buildSections(formGroup);
    const form = <FormGroup>this.form.get('sections');
    if (form) {
      this.form.setControl('sections', formGroup);
      form.updateValueAndValidity();
    } else {
      this.form.addControl('sections', formGroup);
    }
  }

  buildSections(groupControl: FormGroup) {
    this.panels.forEach((panel: Panel, index: number) => {
      if (panel) {
        const formGroup = <FormGroup>groupControl.controls[panel.sectionId] || this.commonService.getFormGroup({});
        const types = ['fields', 'tabs'];
        types.forEach(type => {
          this.commonService.buildPanelDetails(type, panel, formGroup, this.isAdmin);
        });
        groupControl.addControl(panel.sectionId, formGroup);
      }
    });
  }

  toggleChange(event: Panel, index, panel: Panel, isCollapsable = false) {
    if (isCollapsable) {
      this.panels[index].collapsable = event.collapsable;
      if (!this.panels[index].collapsable) {
        this.panels[index].collapsed = true;
        this.panels[index].isOpen = false;
      }
    } else {
      this.panels[index].collapsed = event.collapsed;
    }
  }

  isFieldValid(field: string, index) {
    if (field) {
      // return !this.form.get(field).valid && this.form.get(field).touched;
      return this.panels[index].sectionName.length > 0 ? false :  true;
    }
    return false;
  }

  onChange(index, event) {
    // this.panels[index].sectionName = this.form.get(this.panels[index].sectionId).value;
    this.panels[index].sectionName = event.target.value;
  }

  delete(section: Panel) {
    this.isSectionDependent = this.isDependentonField(section);
    this.deleteSection = section;
    this.confirmationModal = true;
  }

  confirmDeletePanel() {
    this.confirmationModal = false;
    this.panels = _.without(this.panels, this.deleteSection);
    const formGroup = <FormGroup>this.form.get('sections');
    formGroup.removeControl(this.deleteSection.sectionId);
    this.deletePanel.emit(this.deleteSection);
  }

  deleteTab(event, index) {
    this.panels[index].tabs = _.without(this.panels[index].tabs, event);
  }

  getControlGroup(panelId: string, type) {
    return this.form.get(['sections', panelId, type]);
  }

  isDependentonField(section: Panel) {
    const dependentList = _.where(this.appFieldDependentList, {sectionId: section.sectionId});
    let deleteStatus = false;
    if (dependentList && dependentList.length > 0) {
      dependentList.forEach(element => {
        if (element) {
          const dependentSection = <FormGroup>this.form.get(['sections', element.dependentView]);
          if (dependentSection) {
          const dependentField = <FormGroup>dependentSection.get(['fields']).get(element.fieldName);
            if (dependentField && !dependentField.disabled) {
              this.dependentSectionDetails = _.where(this.panels, { sectionId: element.dependentView })[0].sectionName;
              deleteStatus = true;
            }
          }
        }
        if (deleteStatus) {
          return;
        }
      });
    }
    return deleteStatus;
  }

}
