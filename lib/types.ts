//Types para la base de datos

//Comida
export type Comida = {
    ID_Comida: number;
    Nombre: string;
    Precio: number;
    Tipo: string;
  };


//Empleado
export type Empleado = {
    Id_Empleado: number;
    Nombre: string;
    Departamento: string;
    Imagen: string; // nombre del archivo o URL relativa
  };
  
  // Consumo
  export type Consumo = {
    Id_Consumo: number;
    ID_Comida: number;
    ID_Empleado: number;
    Fecha: string; // formato ISO string
    Precio: string; // puede cambiarse a number si prefieres trabajar con números
  };