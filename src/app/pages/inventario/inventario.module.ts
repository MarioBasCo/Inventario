import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioPageRoutingModule
  ],
  providers: [DatePipe],
  declarations: [InventarioPage]
})
export class InventarioPageModule {}
