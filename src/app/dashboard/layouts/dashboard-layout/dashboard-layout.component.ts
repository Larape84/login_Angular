import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'
import { UtilsService } from 'src/app/auth/services/utils.service';
import * as moment from 'moment'

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {

  private authService = inject( AuthService );
  public arrayBuffer:any;
  public loading: boolean = false;
  public filedata:any = null;
  public json:any
  public dataJson:any =[]
  public encabezado: any ={
      "idTurno": null,
      "idServicio": null,
      "numTurno": null,
      "region": null,
      "fechaCreacion": null,
      "oficina": null,
      "sala": null,
      "cliente": null,
      "tipoCliente": null,
      "proceso": null,
      "subproceso": null,
      "agrupamiento": null,
      "tramite": null,
      "cola": null,
      "anioMes": null,
      "horaSolicitud": null,
      "horaFinEspera": null,
      "horaLlamado": null,
      "horaFinLlamado": null,
      "horaFinAtencion": null,
      "espera": null,
      "llamado": null,
      "atencion": null,
      "total": null,
      "usuario": null,
      "nombreUsuario": null,
      "terminal": null,
      "estado": null,
      "dia": null,
      "hora": null,
      "nombreCliente": null,
      "razonSocial": null,
      "identificacion": null,
      "tipoIdentificacion": null,
      "serInscripcionRut": null,
      "serNumeroFormulario": null,
      "serCantidadFolios": null,
      "serResultadoDelTramite": null,
      "serGestionDelCasoAPST": null,
      "serObservaciones": null,
      "serTemaDeCapacitacionOrientacion": null,
      "serOtrosServicios": null,
      "serActualizacionRut": null,
      "serLevantamientoSuspension": null,
      "serObjetoDeCampana": null,
      "serResultadoCobranzas": null,
      "serMensajeDeRespuesta": null,
      "turTipoDeIdentificacionTramitante": null,
      "turClasificacionTramitante": null
    }

  public ruta: string = 'archivo'
  public user = computed(() => this.authService.currentUser() );

  public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril' ];
  public lineChartData: Array<any> = [
    { data: [ 0, 0, 0, 0 ], label: 'Ventas'}
  ];

  constructor (private _service : UtilsService){}


  // get user() {
  //   return this.authService.currentUser();
  // }

  public onLogout() {
    this.authService.logout();
  }

  public changeRuta(ruta: string): void {
    this.ruta = ruta
  }

  public incomingfile(event: any) 
  {
  this.filedata= event.target.files[0]; 
  console.log(this.filedata)
  }

  public startLoading({ title = 'Cargando', html = 'Por favor espere' }): void {

    Swal.fire({ title, html, allowOutsideClick: false, timer: 500000, didOpen: () => { Swal.showLoading() }, })

  }

  public stopLoading(): void {
    Swal.close();
  }

  public alertSuccess(): void {


    Swal.fire({
      allowOutsideClick: true,
      backdrop: true,
      title: 'Correcto!',
      text: "Solicitud realizada correctamente",
      icon: 'success',
      confirmButtonColor: '#3085d6',
      customClass: {
        confirmButton: 'rounded-full w-20 bg-blue-400 ring-0'
      }
    })
  }

  public Upload() {
    this.loading = true;
    this.startLoading({});
    

    const encabezadosArray = Object.keys(this.encabezado)
    let fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();

          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          console.log(worksheet);
          this.json = XLSX.utils.sheet_to_json(worksheet,{raw:true})


          this.json.forEach((element:any) => {

            const nombresExcel = Object.keys(element)
            const row:any = {}
            encabezadosArray.forEach((encabezado, index)=>{
              if(encabezado === 'fechaCreacion'){
                console.log(element[nombresExcel[index]]);
                row[encabezado] = moment(element[nombresExcel[index]],  'DD/MM/YYYY h:mm:ss a').format('YYYY-MM-DD h:mm')
              }else{
                row[encabezado] = element[nombresExcel[index]]

              }
            })

            this.dataJson.push({...row})


          });

          
          setTimeout(() => {
            this.guardarData(this.dataJson);

            }, 1000);
      }
      fileReader.readAsArrayBuffer(this.filedata);

    } 

    
  public alertError(): void {

    // this.stopLoading();

    Swal.fire({
      allowOutsideClick: true,
      backdrop: true,
      title: 'Error!',
      text: "Su solicitud no pudo ser procesada, por favor intente nuevamente",
      icon: 'error',
      customClass: {
        confirmButton: 'rounded-full w-20 bg-gray-400 ring-0'
      }
    })
  }


    public guardarData(data: any): void {

      

      this._service.guardarData(data).subscribe({
        next:(resp)=>{
          console.log(resp);
          this.stopLoading();
          this.alertSuccess();
        },
        error:()=>{
          this.alertError();
        }
      })
    }


}
