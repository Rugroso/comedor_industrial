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
   Imagen: string; // URL de la imagen del empleado
 };

 // Tipo para los contadores de comidas por tipo
export type ConteoComidasPorTipo = { 
  desayuno: number; // Desayuno
  comida: number; // Comida
  otro: number; // Tipo de comida no especificado
  total: number; // Total de comidas
}

export type ConsumoDia = {
  ID_Consumo?: number; // ID del consumo|
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

// Types para los reportes
export type ReporteDetallado = {
  fecha: string;  // fecha del consumo
  consumos: { 
    fecha: string;  // fecha del consumo
    hora: string; // hora del consumo
    empleado: string; // nombre del empleado
    departamento: string; // nombre del departamento
    comida: string; // nombre de la comida
    tipo: string; // desayuno o comida
    precio: number; // precio de la comida
  }[];
  totales: {
    desayunos: number; // cantidad de desayunos
    comidas: number;  // cantidad de comidas
    otros: number;  // cantidad de otros tipos de comida
    total: number;      // total de comidas
    importe: number; // total monetario de comidas      
  };
};

export type ReporteEjecutivo = {
  mes: string;  // mes del reporte
  departamentos: {
    nombre: string; // nombre del departamento
    consumos: number; // cantidad de consumos
    importe: number;  // total monetario de consumos
  }[];
  totales: {
    consumos: number; // cantidad total de consumos
    importe: number;  // total monetario de consumos
  };
  porTipo: {
    desayunos: number;  // cantidad de desayunos
    comidas: number;  // cantidad de comidas
    cenas: number;  // cantidad de cenas
    otros: number;  // cantidad de otros tipos de comida
  };
};

export type ReporteDia = {
  fecha: string;  // fecha del reporte
  departamentos: {
    nombre: string; // nombre del departamento
    consumos: number; // cantidad de consumos
    importe: number;  // total monetario de consumos
  }[];
  totales: {
    desayunos: number;  // cantidad de desayunos    
    comidas: number;  // cantidad de comidas
    cenas: number;  // cantidad de cenas
    total: number;  // cantidad total de comidas 
    importe: number;  // total monetario de consumos 
  };
};
 