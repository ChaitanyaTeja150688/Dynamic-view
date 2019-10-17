import { Component, OnInit } from '@angular/core';
import { ViewList, MetaData, Response } from 'src/interfaces/view-list';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { DatePipe } from '@angular/common';
import 'rxjs-compat/add/operator/map';
import { UserListResponse } from 'src/interfaces/common.interface';
import * as _ from 'underscore';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  filteredData = [];
  appIdList = [];
  headerCoulmns = [];
  materialDetails = [];
  selectedAppDetails;
  appNumber = '';
  workItemID = '';
  showLoader = false;
  workItemsList = [];
  pagedResults = [];
  currentPage = 1;
  workItemPagedResults = [];
  workItemCurrentPage = 1;
  pageSize = 5;
  constructor(
    private route: Router,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.userDataService.resetConfig();
    this.getMetaData();
  }

  getMetaData() {
    this.showLoader = true;
    this.userDataService.getMetaDataList().subscribe((response) => {
      this.appIdList = response.apps;
      this.selectedAppDetails = _.where(this.appIdList, { 'appId' : 'BUS1001006'})[0];
      this.getConfigDetails(true);
    });
  }

  getConfigWorkItemsIds() {
    if (this.selectedAppDetails.appId) {
      this.showLoader = true;
      this.userDataService.getUserWorkItemDetails(this.selectedAppDetails.appId).subscribe((response: any) => {
        this.workItemsList = _.sortBy(response.workItemList, function(o) { return -o.workitemId; });
        this.getWorkItemPageChanged();
        this.showLoader = false;
      });
    }
  }

  getConfigDetails(status =  false) {
    if (this.selectedAppDetails.appId) {
      if (status) {
        this.getConfigWorkItemsIds();
      }
      this.showLoader = true;
      this.userDataService.getDashboardData(this.selectedAppDetails.appId).subscribe((response: Response) => {
        this.materialDetails = _.sortBy(response.views, function(o) { return -o.configId; });
        this.currentPage = 1;
        this.getPageChanged();
        this.showLoader = false;
      });
    }
  }

  getWorkItemsID() {
    if (this.workItemID) {
      this.showLoader = true;
      this.userDataService.getUserWorkItemID(this.workItemID).subscribe((response: any) => {
        this.userDataService.userTypeView = 'EditWorkItem';
        this.userDataService.userAppId = this.selectedAppDetails.appId;
        this.userDataService.userConfigId = '';
        this.userDataService.workItemDetails['keyId'] = '';
        this.userDataService.workItemDetails['workitemId'] = this.workItemID;
        this.route.navigate(['/user-view']);
      });
    }
  }

  editWorkItem(workItem) {
    this.userDataService.userTypeView = workItem.keyId ? 'EditMaterialItem' : 'EditWorkItem';
    this.userDataService.userAppId = this.selectedAppDetails.appId;
    this.userDataService.userConfigId = '';
    this.userDataService.workItemDetails = workItem;
    this.route.navigate(['/user-view']);
  }

  createMaterial() {
    this.userDataService.userTypeView = 'CreateView';
    this.userDataService.userAppId = '';
    this.userDataService.userConfigId = '';
    this.route.navigate(['/user-view']);
  }

  createUseView(view) {
    if (this.selectedAppDetails.appId) {
      this.userDataService.userTypeView = 'CreateView';
      this.userDataService.userAppId = this.selectedAppDetails.appId;
      this.userDataService.userConfigId = view.configId;
      this.route.navigate(['/user-view']);
    }
  }

  getObjectData() {
    const body = {
      appId: this.selectedAppDetails.appId,
      number: this.appNumber
    };
    this.userDataService.getUserSearchDetails(body).subscribe((response: UserListResponse) => {
      this.headerCoulmns = response.columns;
      this.filteredData = response.data;
      this.selectedAppDetails = {};
      this.appNumber = '';
      this.showLoader = false;
    });
  }

  addSpacing(columnName: string) {
    columnName.replace(/[A-Z]/g, ' ');
    return columnName;
  }

  pageChange(event) {
    this.currentPage = event.currentPage;
    this.getPageChanged();
  }

  getPageChanged() {
    const start: number = (this.currentPage - 1) * this.pageSize;
    const end: number = start + this.pageSize;
    this.pagedResults = this.materialDetails.slice(start, end);
  }

  workItemPageChange(event) {
    this.workItemCurrentPage = event.currentPage;
    this.getWorkItemPageChanged();
  }

  getWorkItemPageChanged() {
    const start: number = (this.workItemCurrentPage - 1) * this.pageSize;
    const end: number = start + this.pageSize;
    this.workItemPagedResults = this.workItemsList.slice(start, end);
  }

}
