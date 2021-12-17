import { DbService } from './../../services/db.service';
import { IProducto } from './../../interfaces/interfaces';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-escaner',
  templateUrl: './escaner.page.html',
  styleUrls: ['./escaner.page.scss'],
})
export class EscanerPage implements OnInit {
  constructor(
    private barcodeScanner: BarcodeScanner, 
    private serBD: DbService){
  }

  ngOnInit() {
      
  }

  scan(){
    let obj = null;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      obj = JSON.parse(barcodeData.text);
      if ( !obj.hasOwnProperty('id') || 
        !obj.hasOwnProperty('codigo') || 
        !obj.hasOwnProperty('nombre') ) {
        alert("No se reconoce el producto");
      } else {
        const { id, codigo, nombre } = obj;
        let objProd: IProducto = {
          id,
          codigo,
          nombre,
          cantidad: 0
        }

        this.serBD.grabar(objProd, true);
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }
  
}
