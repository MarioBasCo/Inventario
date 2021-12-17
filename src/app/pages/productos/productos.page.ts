import { DbService } from './../../services/db.service';
import { RegistroPage } from './../../modals/registro/registro.page';
import { IProducto } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  objVacio: IProducto = {
    codigo: "",
    nombre: "",
    cantidad: 0
  };
  listaProductos: IProducto[] = [];
  encodedData: any;
  scannedBarCode: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(
    private modalCtrl: ModalController,
    private serBD: DbService,
    private scanner: BarcodeScanner,
    private plt: Platform,
    private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    this.serBD.$getListSource.subscribe(list => {
      this.listaProductos = list;
    });
  }

  async nuevoRegistro() {
    const modal = await this.modalCtrl.create({
      component: RegistroPage,
      componentProps: {
        objProducto: this.objVacio
      },
      cssClass: 'setting-modal',
      showBackdrop: true,
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log(" retorna el del Modal: ", data);
      this.serBD.grabar(data.objProducto, false);
      this.limpiar();
    }
  }

  limpiar() {
    this.objVacio.codigo = '';
    this.objVacio.nombre = '';
    this.objVacio.cantidad = 0;
  }

  /* generateBarCode(obj: any) {
    const { id, codigo, nombre } = obj;
    let textQr = {
      id,
      codigo,
      nombre
    }
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, textQr).then(
        res => {
          alert(res);
          this.encodedData = res;
        }, error => {
          alert(error);
        }
    );
  } */

  generateBarCode(obj: any) {
    const { id, codigo, nombre } = obj; //destructuring del objeto
    let textQr = { id, codigo, nombre }; //objeto con información que no cambia

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 10, 40, 60],
      content: [
        { qr: `${textQr}`, fit: '150' },
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
          let path = `codigosqr_${Date.now()}.pdf`;
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
}
