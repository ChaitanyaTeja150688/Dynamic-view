import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FieldSet } from '../field-list/field-list.component';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
    selector: 'app-table-component-panel',
    templateUrl: './table-component-panel.component.html',
    styleUrls: ['./table-component-panel.component.scss']
})
export class TableComponentPanelComponent implements OnInit {
    @Input() fieldList: FieldSet;
    @Input() form: FormGroup;
    @Input() hideLabel = false;
    @Output() changeEventEmitter = new EventEmitter<any>();
    constructor(
        public formBuilder: FormBuilder,
        private userDataService: UserDataService
    ) { }

    ngOnInit() { }

    changeEvent(event, fieldList) {
        this.changeEventEmitter.emit(event);
    }


    // getControlValue(fieldName: string) {
    //     if (this.answers) {
    //         const keys = Object.keys(this.answers);
    //         if (keys.length) {
    //             return this.answers[fieldName] ? this.answers[fieldName] : null;
    //         }
    //     }
    //     return null;
    // }

    // getMasterValeus(element) {
    //     const filteredArray = _.find(this.userDataService.dropDownList, { 'fieldName': element.fieldName });
    //     return filteredArray ? filteredArray.dropdowns : [];
    // }
}
