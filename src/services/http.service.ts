import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable()

export class HttpService {

  constructor(
    private http: HttpClient
  ) {}

  private headers = new HttpHeaders({
    'Pragma': 'no-cache',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'Accept': 'application/json',
    'userName': 'AMITIWARI',
    'password': 'Zaq$$9090',
    'X-CSRF-Token': 'Fetch'
  });

  /**
   * @method get
   * @augments {url}
   * @description Used for all Get calls.
   * @returns object
   */

  get(url: string) {
    const observable = new Observable(observer => {
      this.http.get(url, { observe: 'response', headers: this.headers })
      .subscribe((res: HttpResponse<Response>) => {
        observer.next(res);
      });
    });
    return observable;
  }

  /**
   * @method POST
   * @augments {url, body}
   * @description Used for all POST calls.
   * @returns object
   */
  post(url: string, body: object) {
    const observable = new Observable(observer => {
      this.http.post(url, body, { observe: 'response', headers: this.headers })
      .subscribe((res: HttpResponse<Response>) => {
        observer.next(res);
      });
    });
    return observable;
  }

  /**
   * @method PUT
   * @augments {url, body}
   * @description Used for all POST calls.
   * @returns object
   */
  put(url: string, body: object) {
    const observable = new Observable(observer => {
      this.http.put(url, body, { observe: 'response', headers: this.headers })
      .subscribe((res: HttpResponse<Response>) => {
        observer.next(res);
      });
    });
    return observable;
  }
}
