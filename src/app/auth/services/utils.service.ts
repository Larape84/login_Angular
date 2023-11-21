import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const url = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _http : HttpClient, ) { }

  public loadGraficaOne(rangoFechas: any): Observable<any[]>{
    const endpoint = 'api/reportes/tramite'
    return this._http.post<any[]>(`${url}/${endpoint}`, {...rangoFechas})
  }

  public loadGraficaTwo(rangoFechas: any): Observable<any[]>{
    const endpoint = 'api/reportes/estado'
    return this._http.post<any[]>(`${url}/${endpoint}`, {...rangoFechas})
  }


  public loadGraficaTree(rangoFechas: any): Observable<any[]>{
    const endpoint = 'api/reportes/tiempo-atencion'
    return this._http.post<any[]>(`${url}/${endpoint}`, {...rangoFechas})
  }


  public guardarData(data: any): Observable<any[]> {
    const endpoint = 'reportes/saveAll'
    const headers = new HttpHeaders({
      // Authentication: ``,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
  });
    return this._http.post<any[]>(`${url}/${endpoint}`, data, {headers})
  }

}
