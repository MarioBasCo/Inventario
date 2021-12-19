import { DbService } from './../../services/db.service';
import { IProducto } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FormProductoComponent } from 'src/app/modals/form-producto/form-producto.component';
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

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private serBD: DbService,
    private plt: Platform,
    private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos(){
    this.listaProductos = [];
    this.serBD.$getListSource.subscribe(list => {
      this.listaProductos = list;
    });
  }

  async openModalForm() {
    const modal = await this.modalCtrl.create({
      component: FormProductoComponent,
      componentProps: {
        titulo: 'Registro',
        objProducto: this.objVacio
      },
      cssClass: 'reg-modal',
      showBackdrop: true,
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const { codigo, nombre, cantidad } = data.objProducto;
      let datosPro: IProducto = {
        codigo,
        nombre,
        cantidad
      }
      console.log(" retorna el del Modal: ", datosPro);
      this.serBD.grabar(datosPro, false);
      //this.cargarDatos();
      this.limpiar();
    }
  }

  limpiar() {
    this.objVacio.codigo = '';
    this.objVacio.nombre = '';
    this.objVacio.cantidad = 0;
  }
  
  async editar(item: IProducto){
    const { id, codigo, nombre } = item; //destructuring para evitar la referencia al objeto
    let objEditar: IProducto = {id, codigo, nombre};

    const modal = await this.modalCtrl.create({
      component: FormProductoComponent,
      componentProps: {
        titulo: 'Edición',
        objProducto: objEditar
      },
      cssClass: 'reg-modal',
      showBackdrop: true,
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const { id, codigo, nombre } = data.objProducto;
      let datosPro: IProducto = {
        id,
        codigo,
        nombre
      }
      console.log(" retorna el del Modal: ", JSON.stringify(datosPro));
      this.serBD.grabar(datosPro, true);
    }
    
  }

  async eliminar(item: any){
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Esta seguro de <strong>eliminar</strong> el producto: ${item.nombre} ?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Confirm Okay');
            this.serBD.eliminar(item.id);
          }
        }
      ]
    });

    await alert.present();
  }

  generateBarCode(obj: any) {
    const { id, codigo, nombre } = obj; //destructuring del objeto
    let textQr: IProducto = { id, codigo, nombre }; //objeto con información que no cambia

    const docDefinition = {
      header: {
        margin: 10,
        columns: [
          {
            margin: [10, 0, 0, 0],
            text: `${textQr.codigo}\t${textQr.nombre}`,
            style: 'header',
            alignment: 'center'
          }
        ]
      },
      content: [
        this.numCodigosQR(JSON.stringify(textQr))
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        }
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

  numCodigosQR(textQr: string){ //imprime 3 columas y 4 filas
    let data = [];
    for(let i=0; i<=3; i++){
      data.push(
        [{
          columns: [
            { qr: `${textQr}`, fit: '150' },
            { qr: `${textQr}`, fit: '150' },
            { qr: `${textQr}`, fit: '150' }
          ],
        },'\n']
      );
    }
    return data;
  }
}
