import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DbService } from './../../services/db.service';
import { IProducto } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  listaProductos: IProducto[] = [];
  pdfObj: any;
  externalDataRetrievedFromServer = [
    { name: 'Bartek', age: 34 },
    { name: 'John', age: 27 },
    { name: 'Elizabeth', age: 30 },
  ];

  constructor(
    public datepipe: DatePipe,
    private serBD: DbService,
    private plt: Platform,
    private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    this.serBD.$getListSource.subscribe(list => {
      this.listaProductos = list;
    });
  }

  downloadPdf() {
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 10, 40, 60],
      content: [
        { text: 'Reporte de Inventario', style: 'header', alignment: 'center' },
        { text: `Fecha de Impresión: ${this.datepipe.transform(new Date(), 'dd/MM/yyyy')}`, style: 'subheader', alignment: 'right' },
        { text: `Hora de Impresión: ${this.datepipe.transform(new Date(), 'h:mm:ss a')}\n\n`, style: 'subheader', alignment: 'right' },
        this.table(this.listaProductos, ['id', 'codigo', 'nombre', 'cantidad'])
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'justify'
        },
        subheader: {
          fontSize: 14
        },
      }
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    if (this.plt.is('cordova')) {
      pdfDocGenerator.getBase64(async (data) => {
        try {
          let path = `inventario_${Date.now()}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.Documents
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf')
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      pdfDocGenerator.download();
    }
  }

  buildTableBody(data, columns) {
    let body = [];
    body.push([
      { text: 'ID', alignment: 'center', bold: true },
      { text: 'CÓDIGO', alignment: 'center', bold: true },
      { text: 'DETALLE', alignment: 'center', bold: true },
      { text: 'STOCK', alignment: 'center', bold: true }
    ]);

    data.forEach((row) => {
      let dataRow = [];
      columns.forEach(column => {
        dataRow.push(row[column].toString());
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data, columns) {
    return {
      table: {
        widths: [100, '*', '*', 100],
        headerRows: 1,
        body: this.buildTableBody(data, columns)
      }
    };
  }
}
