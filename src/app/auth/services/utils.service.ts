import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const url = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _http : HttpClient, ) { }



  public guardarData(data: any): Observable<any[]> {
    const endpoint = 'reportes/saveAll'
    return this._http.post<any[]>(`${url}/${endpoint}`, {data})
  }

}
