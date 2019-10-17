import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FieldSet } from '../field-list/field-list.component';
import * as _ from 'underscore';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Tab } from 'src/interfaces/panel.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() tabList: Array<any>;
  @Input() isAdmin: Boolean = true;
  @Input() form: FormGroup;
  @Input() answers = {};
  @Input() isTable = false;
  @Input() sectionId;
  @Output() deleteTabEmitter = new EventEmitter<Tab>();
  fieldList: FieldSet[] = [];
  fieldItems;
  tableColumns = [];
  tableRows = [];
  tabTableRows = [];
  tabIndex = 0;
  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setTabFields();
  }

  setTabFields() {
    if (this.tabList.length) {
      const activeTab = _.where(this.tabList, { active: true });
      if (activeTab.length > 0) {
        this.showActiveTabList(activeTab[0], 0);
      } else {
        this.tabList[0].active = true;
        this.showActiveTabList(this.tabList[0], 0);
      }
    }
  }

  showActiveTabList(item, index) {
    if (!this.isTable) {
      this.tabList.forEach((element) => {
        element.active = false;
        if (item === element) {
          item.active = true;
          this.fieldItems = Object.keys(item);
          this.fieldList = item;
        }
      });
    } else {
      if (item.tabTableRows) {
        this.tabIndex = index;
        this.resetActiveTab(index);
        this.tabTableRows = item.tabTableRows;
      }
    }
  }

  getControlGroup(tabId: string, type) {
    return this.form.get([tabId]);
  }

  deleteTab(item: Tab) {
    if (this.tabList.length > 1) {
      this.tabList = _.without(this.tabList, item);
      this.showActiveTabList(this.tabList[0], 0);
      this.form.removeControl(item.tabId);
      this.deleteTabEmitter.emit(item);
    }
  }

  resetActiveTab(index) {
    this.tabList.forEach((item, ind: number) => {
      item.active = (ind === index);
    });
  }

}
