import { IProducto } from './../../interfaces/interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  @Input() objProducto: IProducto;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrarseModal() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss({
      objProducto: this.objProducto
    });
  }
}
