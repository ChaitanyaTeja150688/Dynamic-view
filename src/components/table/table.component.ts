import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { FieldSet } from '../field-list/field-list.component';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TableRow } from 'src/interfaces/panel.interface';
import { CommonService } from 'src/services/common.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
    @Input() isAdmin = true;
    @Input() form: FormGroup;
    @Input() isTable = false;
    @Input() tabTableRows: TableRow[];
    tabTableDetails = {
        sectionId: '',
        tabId: ''
    };
    pagedResults = [];
    currentPage = 1;
    pageSize = 5;

    constructor(
        public formBuilder: FormBuilder,
        private commonService: CommonService
    ) { }

    ngOnChanges() {
        this.getPageChanged();
    }

    addNewRow() {
        const tableRow: TableRow = _.clone(this.tabTableRows[0]);
        tableRow.sequence = this.getNextSequence().toString();
        tableRow.rows.forEach((column: FieldSet) => {
            column.fieldValue = '';
            column.sequence = tableRow.sequence;
        });
        const formGroup = this.commonService.getFormGroup({});
        this.commonService.buildPanelFields(formGroup, tableRow.rows, this.isAdmin);
        this.form.addControl(tableRow.sequence, formGroup);
        this.tabTableRows.push(tableRow);
    }

    getNextSequence() {
        const arrayLength = this.tabTableRows.length;
        const lastSequence = this.tabTableRows[arrayLength - 1].sequence;
        return Number(lastSequence) + 1;
    }

    pageChange(event) {
        this.currentPage = event.currentPage;
        this.getPageChanged();
    }

    getPageChanged() {
        const start: number = (this.currentPage - 1) * this.pageSize;
        const end: number = start + this.pageSize;
        this.pagedResults = this.tabTableRows.slice(start, end);
    }

    getControlGroup(row: TableRow, column: FieldSet) {
        return this.form.get([row.sequence]);
    }

    deleteRow(row: TableRow, index: number) {
        this.tabTableRows = _.without(this.tabTableRows, row);
        this.form.removeControl(row.sequence);
    }

    changeEvent(event, fieldList, row, index, rowIndex) {
        console.log(event);
        if (event.fieldName === this.tabTableRows[index].rows[rowIndex].fieldName) {
            row.rows[rowIndex].fieldValue = event.value;
            this.tabTableRows[index] = row;
        }
        console.log(this.tabTableRows);
    }
}
