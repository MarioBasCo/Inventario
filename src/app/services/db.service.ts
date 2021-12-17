import { IProducto } from './../interfaces/interfaces';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private listSource = new BehaviorSubject<any[]>([]);
  $getListSource = this.listSource.asObservable();

  readonly nombreBD: string = "BD_PRODUCTOS.db";
  databaseObj: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.crearBD();
  }

  sendListSource(list: any[]) {
    this.listSource.next(list);
  }

  crearBD() {
    this.sqlite.create({
      name: this.nombreBD,
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.databaseObj = db;
      this.crearTablasBD();
      this.cargarDatosBD();
    }).catch(e => console.log(e));
  }

  crearTablasBD() {
    let cadenaSql = ""
    cadenaSql = cadenaSql + " create table if not exists TB_PRODUCTO ";
    cadenaSql = cadenaSql + " (id integer primary key AutoIncrement, codigo varchar(10), ";
    cadenaSql = cadenaSql + " nombre varchar(80), cantidad integer)";
    this.databaseObj.executeSql(cadenaSql, []).then((resp) => {
      //alert("la tabla fue creada correctamente");
    }).catch(e => {
      alert("Error al crear la table" + JSON.stringify(e));
    })
  }

  cargarDatosBD() {
    let cadenaSql = " SELECT * FROM TB_PRODUCTO ";

    this.databaseObj.executeSql(cadenaSql, []).then((resp) => {
      if (resp.rows.length > 0) {
        let datosBD = [];
        for (var i = 0; i < resp.rows.length; i++) {
          datosBD.push(resp.rows.item(i));
        }
        this.sendListSource(datosBD);
      }
    }).catch(e => {
      alert("Error al cargar Datos " + JSON.stringify(e));
    });
  }

  grabar(data: IProducto, bandera: boolean) {
    let cadenaSql = "";
    //validar los datos de entrada
    if (data.codigo.length === 0) {
      alert("Ingrese el Código");
      return;
    }
    if (data.nombre.length === 0) {
      alert("Ingrese el nombre");
      return;
    }

    if (bandera) {
      //editar
      cadenaSql = cadenaSql + " UPDATE TB_PRODUCTO ";
      cadenaSql = cadenaSql + " SET ";
      cadenaSql = cadenaSql + " cantidad = cantidad + 1" ;
      cadenaSql = cadenaSql + " WHERE id=" + data.id;
    } else {
      //insertar
      cadenaSql = cadenaSql + " insert into TB_PRODUCTO";
      cadenaSql = cadenaSql + " (codigo, nombre, cantidad) values(";
      cadenaSql = cadenaSql + "'" + data.codigo + "',";
      cadenaSql = cadenaSql + "'" + data.nombre + "',";
      cadenaSql = cadenaSql + data.cantidad + ")";
    }

    this.databaseObj.executeSql(cadenaSql, [])
    .then(() => {
      alert("Se registró con éxito");
      this.cargarDatosBD();
    }).catch(e => {
      alert("Error al registrar: " + JSON.stringify(e));
    });
  }

  eliminar(id) {
    let cadenaSql = " delete from TB_PRODUCTO ";
    cadenaSql = cadenaSql + " where id=" + id;
    this.databaseObj.executeSql(cadenaSql, []).then(() => {
      alert("Se eliminó correctamente");
      this.cargarDatosBD();
    }).catch(e => {
      alert("Error al eliminar: " + JSON.stringify(e));
    });
  }

}