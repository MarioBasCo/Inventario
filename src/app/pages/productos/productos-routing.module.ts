import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  },
  {
    path: 'inventario',
    loadChildren: () => import('./../../modals/registro/registro.module').then( m => m.RegistroPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
