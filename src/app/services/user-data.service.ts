import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { ConfigDetails, MetaData, MetaDataList } from 'src/interfaces/view-list';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs-compat/add/operator/map';
import { UserView } from '../modules/user/user-view-model';
import { text } from '@angular/core/src/render3/instructions';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', 'Basic QU1JVElXQVJJOlphcSQkOTA5MA==')
  .set('Username', 'AMITIWARI')
  .set('Password', 'Zaq$$9090')
  .set('X-CSRF-Token', 'Fetch');

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  url = 'http://localhost:4000/';
  configDetails: ConfigDetails = {
    viewDetails: null,
    viewType: ''
  };
  configFields = {};
  metaData: MetaData;
  dropDownList;
  dropDownKeysList;
  userAppId = '';
  userConfigId = '';
  userTypeView = '';
  workItemDetails;
  constructor(private http: HttpClient) { }

  resetConfig() {
    if (this.configDetails) {
      this.configDetails.viewDetails = {
        appId: '',
        appName: '',
        configId: '',
        configName: '',
        createdBy: '',
        createdByID: '',
        creationDate: '',
        userRole: '',
        userRoleId: ''
      };
    }
  }
  getDashboardData(appId = 'BUS1001006') {
    const path = 'admin/dashboard/' + appId;
    return this.http.get(this.url + path);
  }

  getMetaDataList(): Observable<MetaData> {
    if (this.metaData) {
      return Observable.of(this.metaData);
    } else {
      return this.getMetaData().map((response: MetaDataList) => {
        response.data.apps.forEach((item: any) => {
          item.code = item.appId;
          item.value = item.appName;
        });
        response.data.roles.forEach((item: any) => {
          item.code = item.roleId;
          item.value = item.roleName;
        });
        return this.metaData = response.data;
      });
    }
  }

  getAppDependentList(appId): Observable<any> {
    const path = 'admin/appDependentData/' + appId;
    return this.http.get(this.url + path);
  }

  getConfigDetails(body) {
    const path = 'admin/configfields';
    return this.http.post(this.url + path, body);
  }

  setMetaData(response) {
    this.metaData = response;
  }

  getMetaData(): Observable<any> {
    const path = 'admin/metaData';
    return this.http.get(this.url + path);
  }

  getConfigViewDetails(appId, configId) {
    const path = 'admin/retreiveConfigDetails/' + appId + '/' + configId;
    return this.http.get(this.url + path);
  }

  getConfigBasedAppID(appId: string = 'BUS1001006') {
    const path = 'admin/createView/' + appId;
    return this.http.get(this.url + path);
  }

  getDropDownListBasedAppID(dropDownKeysList) {
    const path = 'api/dropDownList';
    return this.http.post(this.url + path, dropDownKeysList);
  }

  saveAdminConfig(object) {
    const path = 'admin/saveConfigFields';
    return this.http.post(this.url + path, object);
  }

  deleteConfig(object) {
    const path = 'admin/deleteConfig';
    return this.http.post(this.url + path, object);
  }

  getSampleData() {
    return this.http.get('src/sample.txt', { responseType: 'text' as 'json'});
  }

  getUserSearchDetails(object) {
    const path = 'user/getUserList';
    return this.http.post(this.url + path, object);
  }

  getUserWorkItemDetails(appId) {
    const path = 'user/getUserWorkItemList/' + appId;
    return this.http.get(this.url + path);
  }

  getUserWorkItemID(workItemId) {
    const path = 'user/getUserWorkItemDetails/' + workItemId;
    return this.http.get(this.url + path);
  }

  getUserMaterialDetails(materialId) {
    const path = 'user/getUserMaterialDetails/' + materialId;
    return this.http.get(this.url + path);
  }

  getUserViewsList(appId: string) {
    const path = 'user/getUserViewList/' + appId;
    return this.http.get(this.url + path);
  }

  getConfigView(configId: string = '123') {
    const path = 'user/getConfigView/' + configId;
    return this.http.get(this.url + path);
  }

  getConfigData(configId: string = '123') {
    const path = 'user/getConfigData/' + configId;
    return this.http.get(this.url + path);
  }

  saveUserConfigView(body) {
    const path = 'user/userSaveConfig';
    return this.http.post(this.url + path, body);
  }

  convertDateFormat(jsonDate: string) {
    if (jsonDate) {
      const nowDate = new Date(parseInt(jsonDate.substr(6)));
      let day = nowDate.getDate().toString();
      day = (day.length === 1) ? ('0' + day) : day;
      const month = (1 + nowDate.getMonth()).toString();
      return day + '/' + ((month.length === 1) ? ('0' + month) : month) + '/' + nowDate.getFullYear().toString();
    }
    return 'N/A';
  }

}
