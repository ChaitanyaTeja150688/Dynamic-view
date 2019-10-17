import { Injectable } from '@angular/core';
import { Panel, Tab, TableRow, FormContrlsConfig } from 'src/interfaces/panel.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldSet } from 'src/components/field-list/field-list.component';

@Injectable({
    providedIn: 'root'
  })

export class CommonService {

    constructor(
        private formBuilder: FormBuilder
      ) { }

    buildPanelDetails(type: string, panel: Panel, addTo: FormGroup, isAdmin: Boolean) {
        const formGroup = <FormGroup>addTo.controls[type] || this.getFormGroup({});
        if (type === 'fields' && !panel.isTable) {
            this.buildPanelFields(formGroup, panel[type], isAdmin);
        } else if (type === 'tabs' && panel.isTable) {
            this.buildPanelTabs(formGroup, panel[type], isAdmin);
        }
        addTo.addControl(type, formGroup);
    }

    buildPanelTabs(tabsFormGroup: FormGroup, tabs: Tab[], isAdmin: Boolean) {
        tabs.forEach((tab: Tab, index: number) => {
            if (tab) {
                const formGroup = <FormGroup>tabsFormGroup.controls[tab.tabId] || this.getFormGroup({});
                this.buildTables(formGroup, tab, isAdmin);
                tabsFormGroup.addControl(tab.tabId, formGroup);
            }
        });
    }

    buildTables(tableFormGroup: FormGroup, tab: Tab, isAdmin: Boolean) {
        tab.tabTableRows.forEach((tableRow: TableRow, index: number) => {
            if (tableRow) {
                const formGroup = <FormGroup>tableFormGroup.controls[tableRow.sequence] || this.getFormGroup({});
                this.buildPanelFields(formGroup, tableRow.rows, isAdmin);
                tableFormGroup.addControl(tableRow.sequence, formGroup);
            }
        });
    }

    buildPanelFields(formGroup: FormGroup, fields: FieldSet[], isAdmin: Boolean) {
        if (fields.length > 0) {
            fields.forEach((field: FieldSet) => {
                if (field) {
                    const fieldControl = <FormGroup>formGroup.controls[field.fieldName];
                    const control = this.formBuilder.control(
                        this.getFieldValue(field, isAdmin),
                        this.getFieldValidations(field)
                    );
                    if (fieldControl && fieldControl.get([field.fieldName])) {
                        formGroup.get(field.fieldName).setValue(this.getFieldValue(field, isAdmin));
                    } else {
                        formGroup.addControl(field.fieldName, control);
                    }
                }
            });
        }
    }

    getFieldValue(field: FieldSet, isAdmin) {
        return isAdmin ? field.displayName : field.fieldValue;
    }

    getFieldValidations(field: FieldSet) {
        return field.required ? [Validators.required] : null;
    }

    getFormGroup(config: FormContrlsConfig): FormGroup {
        return this.formBuilder.group(config);
    }

}
