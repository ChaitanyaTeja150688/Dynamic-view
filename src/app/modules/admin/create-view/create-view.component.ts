import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserDataService } from '../../../services/user-data.service';
import { Router } from '@angular/router';
import { MetaDataList, TypeList, ConfigDetails, MetaData } from 'src/interfaces/view-list';
import * as _ from 'underscore';
import { Panel } from 'src/interfaces/panel.interface';

@Component({
  selector: 'app-create-view',
  templateUrl: './create-view.component.html',
  styleUrls: ['./create-view.component.scss']
})
export class CreateViewComponent implements OnInit {
  formGroup: FormGroup;
  pageHeader = 'Create View';
  configDetails: ConfigDetails = this.userDataService.configDetails;
  createViewJSON;
  veiwArray = [];
  appsList: TypeList[] = [];
  rolesList: TypeList[] = [];
  showLoader = false;
  appDependentList = [];
  isAppPanelOpen = false;
  appFieldDependentList = [];
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    if (this.configDetails.viewType === 'edit') {
      this.pageHeader = 'Edit View';
    } else {
      this.pageHeader = 'Create View';
    }
    if (!this.configDetails.viewDetails) {
      this.configDetails.viewDetails = {
        appId: '',
        appName: '',
        userRoleId: '',
        configId: '',
        configName: '',
        createdBy: '',
        createdByID: '',
        creationDate: '',
        userRole: ''
      };
    }
    this.formGroup = this.formBuilder.group({
      app: new FormControl(this.configDetails.viewDetails.appId, [Validators.required]),
      role: new FormControl(this.configDetails.viewDetails.userRoleId, [Validators.required]),
      viewName: new FormControl(this.configDetails.viewDetails.configName, [Validators.required]),
      defaultFormGroup: this.formBuilder.group({}),
      tabs: this.formBuilder.array([])
    });
    this.getMetaData();
    // this.defaultFormGroup = this.formBuilder.group({});
  }

  getMetaData() {
    this.showLoader = true;
    this.userDataService.getMetaDataList().subscribe((response) => {
      this.appsList = response.apps;
      this.rolesList = response.roles;
      if (this.configDetails.viewType === 'edit' || this.configDetails.viewType === 'copy') {
        this.retriveConfigDetails();
      } else if (this.configDetails.viewType === 'create-pre-view') {
        this.createViewJSON = this.userDataService.configFields;
        this.veiwArray = Object.keys(this.createViewJSON);
        this.loadDefaultFields(this.userDataService['defaultFields']);
        this.showLoader = false;
      } else {
        this.showLoader = false;
      }
      window.scrollTo(0, 0);
    });
  }

  onAppChange() {
    const appControl = this.formGroup.get('app');
    const roleControl = this.formGroup.get('role');
    if (appControl.value && roleControl.value) {
      this.getAppDependentList();
    }
  }

  getAppDependentList() {
    this.showLoader = true;
    this.appDependentList = [];
    const appControl = this.formGroup.get('app');
    this.userDataService.getAppDependentList(appControl.value).subscribe((response: any) => {
      this.loadDefaultFields(response.dependentList);
      this.showLoader = false;
    });
  }

  loadDefaultFields(dependentList, masterDependentList = []) {
    const defaultFormGroup = (<FormGroup>this.formGroup.get('defaultFormGroup'));
    _.forEach(dependentList, (item) => {
      if (defaultFormGroup.get(item.fieldId)) {
        defaultFormGroup.get(item.fieldId).setValue('');
      } else {
        defaultFormGroup.addControl(item.fieldId, new FormControl(item.fieldValue || '', item.required ? [Validators.required] : null));
      }
      if (masterDependentList.length) {
        const keyValueDetails = _.filter(masterDependentList, { 'fieldId': item.fieldId });
        item.keyValues = keyValueDetails[0].keyValues || [];
      }
      this.appDependentList.push(item);
    });
  }

  onDependentListChange() {
    if (this.formGroup.get('defaultFormGroup').valid) {
      this.getConfigDetails();
    }
  }

  getDefaultFieldValues() {
    const defaultFields = [];
    const defaultFormGroup = (<FormGroup>this.formGroup.get('defaultFormGroup'));
    _.forEach(this.appDependentList, (defaultField: any) => {
      const object = {
        Appid: this.formGroup.get('app').value,
        Fieldvalue: defaultFormGroup.get(defaultField.fieldId).value || '',
        Fieldid: defaultField.fieldId,
        Fieldname: defaultField.fieldName,
        Dependentfield: ''
      };
      defaultFields.push(object);
    });
    return defaultFields;
  }

  getConfigDetails() {
    const object = {
      appId: this.formGroup.get('app').value,
      appName: '',
      defaultFields: this.getDefaultFieldValues()
    };
    this.showLoader = true;
    this.userDataService.getConfigDetails(object).subscribe((response: any) => {
      response.data.accordions = _.sortBy(response.data.accordions, function (o) { return o.sectionId; });
      this.appFieldDependentList = response.appDependentFieldSet;
      this.createViewJSON = response.data;
      this.userDataService.dropDownKeysList = response.dropdownList;
      this.veiwArray = Object.keys(this.createViewJSON);
      this.showLoader = false;
    });
  }

  saveView() {
    if (this.formGroup.valid) {
      this.showLoader = true;
      this.createViewJSON.appId = this.formGroup.get('app').value;
      this.createViewJSON['appName'] = _.filter(this.appsList, { code: this.formGroup.get('app').value }).value;
      this.createViewJSON.configId = (this.configDetails.viewType !== 'edit') ? '' : this.createViewJSON.configId;
      this.createViewJSON.configName = this.formGroup.get('viewName').value;
      this.createViewJSON['defaultFields'] = this.getDefaultFieldValues();
      this.userDataService.saveAdminConfig(this.createViewJSON).subscribe((response: any) => {
        this.route.navigate(['/view-list']);
        this.showLoader = false;
      });
    } else {
      this.validateData();
    }
  }

  retriveConfigDetails() {
    this.showLoader = true;
    this.userDataService.getAppDependentList(this.userDataService.configDetails.viewDetails.appId).subscribe(
      (defaultFieldsResponse: any) => {
        this.userDataService.getConfigViewDetails(this.userDataService.configDetails.viewDetails.appId,
          this.userDataService.configDetails.viewDetails.configId).subscribe((response: any) => {
            response.data.accordions = _.sortBy(response.data.accordions, function (o) { return o.sectionId; });
            this.createViewJSON = response.data;
            this.veiwArray = Object.keys(this.createViewJSON);
            this.setEditCopyPreviewSeting();
            this.loadDefaultFields(response.dependentList, defaultFieldsResponse.dependentList);
            this.showLoader = false;
          }
          );
      }
    );
  }

  preview() {
    if (this.formGroup.valid) {
      this.userDataService.configDetails.viewDetails.appId = this.formGroup.get('app').value;
      this.userDataService.configDetails.viewDetails.appName = '';
      this.userDataService.configDetails.viewDetails.configId =
        (this.userDataService.configDetails.viewType === 'edit') ? this.userDataService.configDetails.viewDetails.configId : '';
      this.userDataService.configDetails.viewDetails.configName = this.formGroup.get('viewName').value;
      this.userDataService.configDetails.viewDetails.userRoleId = this.formGroup.get('role').value;
      this.userDataService.configDetails.viewDetails.userRole = '';
      this.userDataService.configDetails.viewType = 'create-pre-view';
      this.userDataService.configFields = this.createViewJSON;
      this.userDataService['defaultFields'] = this.getPreviewDefaultValues();
      this.route.navigate(['/pre-view']);
    } else {
      this.validateData();
    }
  }

  getPreviewDefaultValues() {
    const defaultFormGroup = (<FormGroup>this.formGroup.get('defaultFormGroup'));
    _.forEach(this.appDependentList, (defaultField: any, key) => {
      this.appDependentList[key]['fieldValue'] = defaultFormGroup.get(defaultField.fieldId).value || '';
    });
    return this.appDependentList;
  }

  setEditCopyPreviewSeting() {
    const appControl = this.formGroup.get('app');
    const roleControl = this.formGroup.get('role');
    if (this.configDetails.viewType === 'edit') {
      appControl.disable();
      roleControl.disable();
    } else if (this.configDetails.viewType === 'copy') {
      this.createViewJSON.configId = '';
    }
  }

  validateData() {
    Object.keys(this.formGroup.controls).forEach(field => {
      const control = this.formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  cancel() {
    this.route.navigate(['/view-list']);
  }

  isFieldValid(field: string) {
    return !this.formGroup.get(field).disabled && !this.formGroup.get(field).valid && this.formGroup.get(field).touched;
  }

  getDefaultAppName() {
    const app = _.find(this.appsList, { code: this.formGroup.get('app').value });
    if (app) {
      return app.value;
    }
    return 'App default fields';
  }

  deletePanel(event, key) {
    _.forEach(event.fields, (field: any) => {
      if (this.formGroup.get(field.fieldName)) {
        this.formGroup.removeControl(field.fieldName);
      }
    });
    this.createViewJSON[key] = _.without(this.createViewJSON[key], event);
  }

}
