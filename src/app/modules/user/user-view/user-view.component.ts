import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { TypeList, MetaDataList, ConfigDetails, MetaData, Response } from 'src/interfaces/view-list';
import * as _ from 'underscore';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  formGroup: FormGroup;
  createViewJSON;
  configDetails: ConfigDetails = this.userDataService.configDetails; // check
  veiwArray = [];
  viewsList = [];
  configAnswers;
  showLoader = false;
  isShow = false;
  appDependentList = [];
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    if (this.userDataService.userAppId) {
      this.formGroup = this.formBuilder.group({
        viewName: new FormControl('')
      });
      if (this.userDataService.userTypeView === 'CreateView') {
        this.getConfigViews();
      } else {
        this.getWorkItemDetails();
      }
    } else {
      this.route.navigate(['/user-list']);
    }
  }

  getWorkItemDetails() {
    this.showLoader = true;
    if (this.userDataService.workItemDetails.keyId) {
      this.userDataService.getUserWorkItemID(this.userDataService.workItemDetails.workitemId).subscribe((response: any) => {
        this.setMaterialOrWorkDetails(response);
      });
    } else {
      this.userDataService.getUserMaterialDetails(this.userDataService.workItemDetails.keyId).subscribe((response: any) => {
        this.setMaterialOrWorkDetails(response);
      });
    }
  }

  setMaterialOrWorkDetails(response) {
    // temporary code to filter duplicates
    _.forEach(response.data.accordions, (accordion: any, index) => {
      const uniqData = _.uniq(accordion.fields, 'fieldName');
      accordion.fields = uniqData;
    });
    // temporary code to filter duplicates
    this.userDataService.dropDownKeysList = response.dropdownList;
    this.getDropDownInfo(response.data);
  }

  getConfigViews() {
    this.showLoader = true;
    this.userDataService.getDashboardData(this.userDataService.userAppId).subscribe((response: Response) => {
      this.viewsList = _.sortBy(response.views, function (o) { return -o.configId; });
      if (this.viewsList.length > 0) {
        this.formGroup.get('viewName').setValue(
          this.userDataService.userConfigId ? this.userDataService.userConfigId : this.viewsList[0].configId);
        this.createUserView();
      }
    });
  }

  getDropDownInfo(configData) {
    this.userDataService.getDropDownListBasedAppID(this.userDataService.dropDownKeysList).subscribe(
      (dropdownResponse: any) => {
        this.userDataService.dropDownList = dropdownResponse.dropdownNav;
        this.setConfigView(configData);
        this.showLoader = false;
      });
  }

  createUserView() {
    const configId = this.formGroup.get('viewName').value;
    this.userDataService.getConfigViewDetails(this.userDataService.userAppId,
      configId).subscribe((response: any) => {
        this.isShow = true;
        this.formGroup = this.formBuilder.group({
          viewName: new FormControl(configId),
          sectionTable: this.formBuilder.array([])
        });
        this.userDataService.dropDownKeysList = response.dropdownList;
        this.getDropDownInfo(response.data);
        this.appDependentList = response.dependentList;
      });
  }

  setConfigView(data) {
    data.accordions = _.sortBy(data.accordions, function (o) { return o.sectionId; });
    this.createViewJSON = data;
    this.veiwArray = Object.keys(this.createViewJSON);
  }

  getUserViewsListData() {
    this.showLoader = true;
    this.userDataService.getUserViewsList(this.userDataService.userAppId).subscribe((response: any) => {
      this.viewsList = response.result;
      if (this.viewsList.length === 1) {
        this.formGroup.get('viewName').setValue(this.userDataService.userConfigId);
        this.showConfigFields();
      } else {
        this.showLoader = false;
      }
    });
  }

  showConfigFields() {
    this.showLoader = true;
    const control = this.formGroup.get('viewName');
    if (control.value) {
      this.isShow = true;
      this.userDataService.getConfigView(control.value).subscribe((response: any) => {
        this.userDataService.getConfigData(control.value).subscribe((res: any) => {
          this.createViewJSON = response.viewDetails;
          this.veiwArray = Object.keys(this.createViewJSON);
          this.configAnswers = res.answers;
          this.showLoader = false;
        });
      });
    }
  }

  getConfigName() {
    const control = this.formGroup.get('viewName');
    if (control.value) {
      const value = _.find(this.viewsList, { configId: control.value });
      if (value) {
        return value.appName;
      }
    }
    return 'Config View';
  }

  validateData() {
    Object.keys(this.formGroup.controls).forEach(field => {
      const control = this.formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    window.scrollTo(0, 0);
  }

  getDefaultFieldValues() {
    const defaultFields = [];
    _.forEach(this.appDependentList, (defaultField: any) => {
      const object = {
        Appid: this.userDataService.userAppId,
        Fieldvalue: defaultField.fieldValue,
        Fieldid: defaultField.fieldId,
        Fieldname: defaultField.fieldName,
        Dependentfield: ''
      };
      defaultFields.push(object);
    });
    return defaultFields;
  }

  saveView() {
    if (this.formGroup.valid) {
      this.showLoader = true;
      this.createViewJSON.WorkItemidInd = '';
      this.createViewJSON['defaultFields'] = this.getDefaultFieldValues();
      this.userDataService.saveUserConfigView(this.createViewJSON).subscribe((response: any) => {
        this.showLoader = false;
        this.cancel();
      });
    } else {
      this.validateData();
    }
  }

  cancel() {
    this.route.navigate(['/user-list']);
  }

  isFieldValid(field: string) {
    const control = this.formGroup.get(field);
    return !control.disabled && !control.valid && control.touched;
  }
}
