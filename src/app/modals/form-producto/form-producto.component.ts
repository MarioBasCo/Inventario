import { IProducto } from '../../interfaces/interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.scss'],
})
export class FormProductoComponent implements OnInit {
  @Input() objProducto: IProducto;
  @Input() titulo: string;
  
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
