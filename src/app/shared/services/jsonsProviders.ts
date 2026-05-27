import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Categories {

  constructor(private readonly http: HttpClient){}

  getCategories(): Observable<any>{
    return this.http.get('/assets/JSONS/categories.json');
  }

  getMessages(): Observable<any>{
    return this.http.get('/assets/JSONS/messages.json')
  }

  getEvent(): Observable<any>{
    return this.http.get('/assets/JSONS/events.json')
  }

  getCartContent(): Observable<any>{
    return this.http.get('/assets/JSONS/cardItems.json')
  }

  getPdv(): Observable<any>{
    return this.http.get('/assets/JSONS/pdv.json')
  }

  getDepartment(): Observable<any>{
    return this.http.get('/assets/JSONS/areas.json')
  }

  getFormats(): Observable<any>{
    return this.http.get('/assets/JSONS/formats.json')
  }


}
