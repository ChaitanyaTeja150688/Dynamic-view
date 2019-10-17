import { FormField } from './form-field.interface';
import { FieldSet } from 'src/components/field-list/field-list.component';

// contract for Panel
export interface Panel {
    fieldType: string;
    sectionId: string;
    sectionName: string;
    collapsed: boolean;
    collapsable: boolean;
    fields?: Array<any>;
    tabs?: Array<Tab>;
    isOpen: boolean;
    isTable: boolean;
}

export interface Tab {
    tabId: string;
    tabName: string;
    active: boolean;
    isLongText: boolean;
    tabTableRows?: Array<TableRow>;
}

export interface TableRow {
    sequence: string;
    tabId: string;
    sectionId: string;
    rows: Array<FieldSet>;
}

export interface FormContrlsConfig {
    [property: string]: {};
  }

