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
  otro: number; // Tipo de comida no especificado
  total: number; // Total de comidas
}

type ConsumoDia = {
  ID_Consumo?: number; // ID del consumo
  Id_Consumo?: number; // ID del consumo
  ID_Empleado?: number; // ID del empleado
  Id_Empleado?: number; // ID del empleado 
  ID_Comida?: number; // ID de la comida
  Id_Comida?: number; // ID de la comida
  Fecha?: string; // Fecha del consumo
  fecha?: string; // Fecha del consumo
  Tipo?: string; // Tipo de comida (desayuno, comida)
  tipo?: string; // Tipo de comida (desayuno, comida)
  Departamento?: string; // Nombre del departamento
  departamento?: string; // Nombre del departamento
  Nombre?: string; // Nombre del empleado
  nombre?: string; // Nombre del empleado 
  Precio?: number | string; // Precio de la comida
  precio?: number | string; // Precio de la comida
  [key: string]: any; // Propiedad adicional
};
 