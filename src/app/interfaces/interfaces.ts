export interface IProducto {
    id?: number; //campo opcional => no se requiere para insert
    codigo: string;
    nombre: string;
    cantidad?: number; // campo opcional => no se requiere para update
}