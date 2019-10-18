import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { ConfigDetails, MetaDataList, TypeList, MetaData } from 'src/interfaces/view-list';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  formGroup: FormGroup;
  createViewJSON = this.userDataService.configFields;
  configDetails: ConfigDetails = this.userDataService.configDetails;
  veiwArray = [];
  showEdit = false;
  appsList: TypeList[] = [];
  rolesList: TypeList[] = [];
  showLoader = false;
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    if (this.userDataService.configDetails) {
      this.configDetails = this.userDataService.configDetails;
      this.formGroup = this.formBuilder.group({
        app: new FormControl(''),
        role: new FormControl('')
      });
      this.getMetaData();
    } else {
      this.route.navigate(['']);
    }
  }

  loadConfigData() {
    this.formGroup.get('app').setValue(this.configDetails.viewDetails.appId);
    this.formGroup.get('role').setValue(this.configDetails.viewDetails.userRoleId);
    // this.formGroup.get('viewName').setValue(this.configDetails.viewDetails.configName);
    this.showEdit = (this.configDetails.viewType === 'pre-view');
    const appControl = this.formGroup.get('app');
    const roleControl = this.formGroup.get('role');
    if (appControl.value && roleControl.value) {
      this.getDropdownDetails();
    }
  }

  getDropdownDetails() {
    this.userDataService.getDropDownListBasedAppID([]).subscribe(
      (dropdownResponse: any) => {
        this.userDataService.dropDownList = dropdownResponse.dropdownNav;
        if (this.configDetails.viewType === 'pre-view') {
          this.userDataService.getConfigViewDetails(this.userDataService.configDetails.viewDetails.appId,
            this.userDataService.configDetails.viewDetails.configId).subscribe((response: any) => {
              this.createViewJSON = response.data;
              this.veiwArray = Object.keys(this.createViewJSON);
              this.showLoader = false;
            });
        } else {
          this.veiwArray = Object.keys(this.createViewJSON);
          this.showLoader = false;
        }
      }
    );
  }

  getMetaData() {
    this.showLoader = true;
    this.userDataService.getMetaDataList().subscribe((response) => {
      this.appsList = response.apps;
      this.rolesList = response.roles;
      this.loadConfigData();
    });
  }

  back() {
    if (this.showEdit) {
      this.route.navigate(['/view-list']);
    } else {
      this.route.navigate(['/createview']);
    }
  }

  editView() {
    this.userDataService.configDetails.viewType = 'edit';
    this.route.navigate(['/createview']);
  }

}
