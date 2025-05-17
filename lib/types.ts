//Types para la base de datos

//Comida
export type Comida = {
  ID_Comida: number; // id de la comida
  Nombre: string; // nombre de la comida
  Precio: number; // precio de la comida
  Tipo: string; // desayuno o comida
 };
 
 //Empleado
 export type Empleado = {
  Id_Empleado: number; // id del empleado
  Nombre: string; // nombre del empleado
  Departamento: string; // nombre del departamento
  Imagen: string; // nombre del archivo o URL relativa
 };
 
 //Consumo
 export type Consumo = {
  Id_Consumo: number; // id del consumo
  ID_Comida: number; // id de la comida
  ID_Empleado: number; // id del empleado
  Fecha: string; // formato ISO string
  Precio: string; // puede cambiarse a number si prefieres trabajar con números
 };
 
 //Datos departamento 
 export type DatosDepartamento = {
   departamento: string; // Nombre del departamento
   cantidad: number; // Cantidad de consumos
   total: number; // Total monetario de consumos
 };
 
 //Consumo detalles
 export type ConsumoConDetalles = Consumo & {
   nombreEmpleado?: string; // Nombre del empleado
   departamentoEmpleado?: string; // Departamento del empleado
   nombreComida?: string; // Nombre de la comida
   tipoComida?: string; // Tipo de comida (desayuno, comida)
 };

 // Tipo para los contadores de comidas por tipo
type ConteoComidasPorTipo = { 
  desayuno: number; // Desayuno
  comida: number; // Comida
  cena: number; // Cena
  otro: number; // Tipo de comida no especificado
  total: number; // Total de comidas
}
 