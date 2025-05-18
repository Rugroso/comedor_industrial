import axios from "axios"
import { Comida, Consumo, Empleado, ConsumoConDetalles } from "./types"
import { Content } from "vaul";

const API_BASE_URL = "https://d57ulgdxpc.execute-api.us-east-2.amazonaws.com";

export const fetchComida = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/comidas`
    )
    console.log(response.data.length)
    let comidaData = response.data.map((item: Comida) => ({
      ID_Comida: item.ID_Comida,
      Nombre: item.Nombre,
      Precio: item.Precio,
      Tipo: item.Tipo,
    }))
    return comidaData
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

export const fetchEmpleados = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/empleados`
    )
    console.log(response.data)
    let empleadosData = response.data.map((item: Empleado) => ({
      Id_Empleado: item.Id_Empleado,
      Nombre: item.Nombre,
      Departamento: item.Departamento,
      Imagen: item.Imagen,
    }))
    return empleadosData
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

export const fetchConsumos = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consumos`
    )
    console.log(response.data)
    let consumosData = response.data.map((item: Consumo) => ({
      Id_Consumo: item.Id_Consumo,
      ID_Comida: item.ID_Comida,
      ID_Empleado: item.ID_Empleado,
      Fecha: item.Fecha,
      Precio: item.Precio,
    }))
    return consumosData
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

//REGISTRAR EMPLEADO
export const registrarEmpleado = async (nombre: string, departamento: string, imagen: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/empleados`,
      {
        Nombre: nombre,
        Departamento: departamento,
        Imagen: imagen
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Empleado registrado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error registrando empleado:", error);
    if (error.response) {
      throw {
        message: `Error del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        originalError: error
      };
    } else {
      throw {
        message: "Error al registrar empleado",
        originalError: error
      };
    }
  }
}


//ELIMINAR EMPLEADO
export const eliminarEmpleado = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/empleados/${id}`
    )
    console.log("Empleado eliminado:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Error eliminando empleado:", error)
    if (error.response) {
      throw {
        message: `Error del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        originalError: error
      }
    } else {
      throw {
        message: "Error al eliminar empleado",
        originalError: error
      }
    }
  }
}

//ACTUALIZAR EMPLEADO
export const actualizarEmpleado = async (
  id: string,
  nombre: string,
  departamento: string,
  imagen?: string
) => {
  try {
    const empleadoActualizado: any = {
      "Nombre": nombre,
      "Departamento": departamento,
      "Imagen": imagen || "default.jpg"
    }

    const response = await axios.put(
      `${API_BASE_URL}/empleados/${id}`,
      empleadoActualizado
    )
    console.log("Empleado actualizado:", response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error("Error de respuesta del servidor:")
      console.error("Status:", error.response.status)
      console.error("Data:", error.response.data)
      console.error("Headers:", error.response.headers)
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      console.error("No se recibió respuesta del servidor:")
      console.error("Request:", error.request)
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error("Error al configurar la solicitud:", error.message)
    }
    console.error("Stack trace:", error.stack)
    throw error
  }
}


//CONSUMO EMPLEADOS
export const fetchConsumosEmpleados = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/empleado/consumos`
    );
    console.log("Datos de consumos por empleado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching consumos por empleado:", error);
    throw error;
  }
};

// Función para obtener las comidas disponibles según la hora
export const obtenerComidasPorHora = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/comidashora`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener comidas por hora');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Función para buscar empleado por ID
interface BuscarEmpleadoResponse {
  [key: string]: any;
}

export const buscarEmpleado = async (
  empleadoId: string | number
): Promise<BuscarEmpleadoResponse | null> => {
  try {
    const response: Response = await fetch(
      `${API_BASE_URL}empleado/consumos?id=${empleadoId}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Empleado no encontrado');
    }

    const data: BuscarEmpleadoResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Función para registrar un consumo
interface RegistrarConsumoParams {
  idEmpleado: string | number;
  idComida: string | number;
}

interface ConsumoRequestBody {
  Id_Empleado: string | number;
  Id_Comida: string | number;
  Fecha: string;
}

interface RegistrarConsumoSuccessResponse {
  success: true;
  data: any;
}

interface RegistrarConsumoErrorResponse {
  success: false;
  message: string;
}

export const registrarConsumo = async (
  idEmpleado: RegistrarConsumoParams["idEmpleado"],
  idComida: RegistrarConsumoParams["idComida"]
): Promise<RegistrarConsumoSuccessResponse | RegistrarConsumoErrorResponse> => {
  try {
    const fecha: string = new Date().toISOString();

    const consumoData: ConsumoRequestBody = {
      Id_Empleado: idEmpleado,
      Id_Comida: idComida,
      Fecha: fecha
    };

    const response: Response = await fetch(`${API_BASE_URL}/consumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consumoData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar consumo');
    }

    const data: any = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : String(error))
    };
  }
};

// Función para obtener consumos por día
export const fetchConsumosPorDia = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consumos/dia`
    );
    console.log("Datos de consumos por día:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo consumos por día:", error);
    throw error;
  }
};

// Función para obtener los consumos del día (alias para mantener compatibilidad)
export const fetchConsumosDia = fetchConsumosPorDia;

// Tipos para los reportes
export type ReporteDetallado = {
  fecha: string;
  consumos: {
    fecha: string;
    hora: string;
    empleado: string;
    departamento: string;
    comida: string;
    tipo: string;
    precio: number;
  }[];
  totales: {
    desayunos: number;
    comidas: number;
    cenas: number;
    otros: number;
    total: number;
    importe: number;
  };
};

export type ReporteEjecutivo = {
  mes: string;
  departamentos: {
    nombre: string;
    consumos: number;
    importe: number;
  }[];
  totales: {
    consumos: number;
    importe: number;
  };
  porTipo: {
    desayunos: number;
    comidas: number;
    cenas: number;
    otros: number;
  };
};

export type ReporteDia = {
  fecha: string;
  departamentos: {
    nombre: string;
    consumos: number;
    importe: number;
  }[];
  totales: {
    desayunos: number;
    comidas: number;
    cenas: number;
    total: number;
    importe: number;
  };
};

export type ReporteHistorico = {
  id: string;
  fecha: string;
  tipo: 'detallado' | 'ejecutivo' | 'dia';
  url: string;
};

export const fetchReporteDetallado = async (fecha: string) => {
  try {
    console.log(`Solicitando reporte detallado para fecha: ${fecha}`)
    const response = await axios.get(`${API_BASE_URL}/reportes/detallado?fecha=${fecha}`)
    console.log("Datos de reporte detallado recibidos:", response.data)

    // Verificar si los datos están vacíos
    if (!response.data) {
      console.warn("El servidor devolvió datos vacíos para reporte detallado")
      throw new Error("No se recibieron datos del servidor")
    }

    // Transformar los datos al formato esperado por el componente
    const reporteFormateado = {
      fecha: response.data.fecha,
      consumos: [], // La API no devuelve la lista detallada de consumos
      totales: {
        desayunos: response.data.resumen?.totalDesayunos || 0,
        comidas: response.data.resumen?.totalComidas || 0,
        total: response.data.resumen?.totalRegistros || 0,
        importe: Number.parseFloat(response.data.resumen?.montoTotal || 0),
      },
    }

    return reporteFormateado
  } catch (error) {
    console.error("Error obteniendo reporte detallado:", error)
    throw error
  }
}

// Modificar la función fetchReporteEjecutivo para eliminar referencias a cenas y otros
export const fetchReporteEjecutivo = async (mes: string) => {
  try {
    console.log(`Solicitando reporte ejecutivo para mes: ${mes}`)
    const response = await axios.get(`${API_BASE_URL}/reportes/ejecutivo?mes=${mes}`)
    console.log("Datos de reporte ejecutivo recibidos:", response.data)

    // Verificar si los datos están vacíos
    if (!response.data) {
      console.warn("El servidor devolvió datos vacíos para reporte ejecutivo")
      throw new Error("No se recibieron datos del servidor")
    }

    // Transformar los datos al formato esperado por el componente
    interface DepartamentoReporte {
      Departamento: string;
      cantidad: string | number;
      monto: string | number;
    }

    const departamentos: {
      nombre: string;
      consumos: number;
      importe: number;
    }[] =
      response.data.porDepartamento?.map((dept: DepartamentoReporte) => ({
      nombre: dept.Departamento,
      consumos: Number.parseInt(dept.cantidad as string),
      importe: Number.parseFloat(dept.monto as string),
      })) || [];

    // Crear objeto para los tipos de comida (solo desayunos y comidas)
    const porTipo = {
      desayunos: 0,
      comidas: 0,
    }

    // Llenar los datos de tipos de comida
    if (response.data.porTipoComida && Array.isArray(response.data.porTipoComida)) {
      interface TipoComidaItem {
        Tipo?: string;
        cantidad?: number | string;
      }

      (response.data.porTipoComida as TipoComidaItem[]).forEach((item: TipoComidaItem) => {
        const tipo: string = item.Tipo?.toLowerCase() || "";
        if (tipo === "desayuno") {
          porTipo.desayunos = Number.parseInt(item.cantidad as string);
        } else if (tipo === "comida") {
          porTipo.comidas = Number.parseInt(item.cantidad as string);
        }
      });
    }

    const reporteFormateado = {
      mes: response.data.periodo,
      departamentos: departamentos,
      totales: {
        consumos: Number.parseInt(response.data.resumen?.totalConsumos || 0),
        importe: Number.parseFloat(response.data.resumen?.montoTotal || 0),
      },
      porTipo: porTipo,
    }

    return reporteFormateado
  } catch (error) {
    console.error("Error obteniendo reporte ejecutivo:", error)
    throw error
  }
}

// Modificar la función fetchReporteDia para eliminar referencias a cenas y otros
export const fetchReporteDia = async () => {
  try {
    console.log("Solicitando reporte del día")
    const response = await axios.get(`${API_BASE_URL}/reportes/dia`)
    console.log("Datos de reporte del día recibidos:", response.data)

    // Verificar si los datos están vacíos o no son un array
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("El servidor devolvió datos en formato incorrecto para reporte del día")
      throw new Error("Formato de datos incorrecto")
    }

    // Agrupar consumos por departamento
    const departamentoMap = new Map()
    const tiposComida = {
      desayuno: 0,
      comida: 0,
    }

    let importeTotal = 0

    // Procesar cada consumo
    response.data.forEach((consumo) => {
      const departamento = consumo.NombreEmpleado?.split(" ")[0] || "Sin departamento"
      const precio = Number.parseFloat(consumo.PrecioComida || 0)
      const tipoComida = consumo.TipoComida?.toLowerCase()

      // Actualizar contadores de tipo de comida
      if (tipoComida === "desayuno") {
        tiposComida.desayuno++
      } else if (tipoComida === "comida") {
        tiposComida.comida++
      }

      // Actualizar importe total
      importeTotal += precio

      // Actualizar datos del departamento
      if (!departamentoMap.has(departamento)) {
        departamentoMap.set(departamento, {
          nombre: departamento,
          consumos: 0,
          importe: 0,
        })
      }

      const deptData = departamentoMap.get(departamento)
      deptData.consumos++
      deptData.importe += precio
      departamentoMap.set(departamento, deptData)
    })

    // Convertir el mapa a un array
    const departamentos = Array.from(departamentoMap.values())

    // Crear el objeto de reporte formateado
    const reporteFormateado = {
      fecha: new Date().toISOString().split("T")[0],
      departamentos: departamentos,
      totales: {
        desayunos: tiposComida.desayuno,
        comidas: tiposComida.comida,
        total: response.data.length,
        importe: importeTotal,
      },
    }

    return reporteFormateado
  } catch (error) {
    console.error("Error obteniendo reporte del día:", error)
    throw error
  }
}


// Función para obtener el conteo de comidas por tipo para el día actual
export const fetchConsumosHoyPorTipo = async () => {
  try {
    console.log("Obteniendo conteo de comidas de hoy por tipo");
    
    // Usamos el endpoint de consumos por día
    const response = await axios.get(
      `${API_BASE_URL}/consumos/dia`
    );
    
    console.log("Datos recibidos de /consumos/dia:", response.data);
    
    // Inicializamos contadores
    const conteo = {
      desayuno: 0,
      comida: 0,
      cena: 0,
      otro: 0,
      total: 0
    };
    
    // Verificamos si tenemos datos para procesar
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log("No hay datos de consumos por día disponibles");
      return conteo;
    }
    
    // Imprimimos la estructura del primer elemento para depuración
    console.log("Estructura del primer elemento:", JSON.stringify(response.data[0], null, 2));
    
    // Procesamos cada entrada
    response.data.forEach(item => {
      // Intentamos extraer diferentes variantes posibles de propiedades
      
      // Para la cantidad
      let cantidad = 1; // Por defecto asumimos 1 si no hay cantidad especificada
      
      if (typeof item.cantidad !== 'undefined') cantidad = Number(item.cantidad);
      else if (typeof item.Cantidad !== 'undefined') cantidad = Number(item.Cantidad);
      else if (typeof item.count !== 'undefined') cantidad = Number(item.count);
      else if (typeof item.Count !== 'undefined') cantidad = Number(item.Count);
      else if (typeof item.total !== 'undefined') cantidad = Number(item.total);
      else if (typeof item.Total !== 'undefined') cantidad = Number(item.Total);
      
      // Para el tipo
      let tipo = '';
      
      if (typeof item.tipoComida !== 'undefined') tipo = item.tipoComida.toLowerCase();
      else if (typeof item.TipoComida !== 'undefined') tipo = item.TipoComida.toLowerCase();
      else if (typeof item.tipo !== 'undefined') tipo = item.tipo.toLowerCase();
      else if (typeof item.Tipo !== 'undefined') tipo = item.Tipo.toLowerCase();
      else if (typeof item.tipo_comida !== 'undefined') tipo = item.tipo_comida.toLowerCase();
      
      console.log(`Procesando item: tipo=${tipo}, cantidad=${cantidad}`, item);
      
      // Si no tenemos tipo pero tenemos algún indicador en el nombre
      if (!tipo && item.nombre) {
        const nombre = item.nombre.toLowerCase();
        if (nombre.includes('desayuno')) tipo = 'desayuno';
        else if (nombre.includes('comida')) tipo = 'comida';
        else if (nombre.includes('cena')) tipo = 'cena';
      }
      
      // Sumamos al contador correspondiente
      if (tipo === 'desayuno') {
        conteo.desayuno += cantidad;
      } else if (tipo === 'comida') {
        conteo.comida += cantidad;
      } else if (tipo === 'cena') {
        conteo.cena += cantidad;
      } else {
        conteo.otro += cantidad;
      }
      
      // Sumamos al total
      conteo.total += cantidad;
    });
    
    console.log("Conteo final:", conteo);
    return conteo;
  } catch (error) {
    console.error("Error obteniendo consumos de hoy por tipo:", error);
    // Devolvemos valores por defecto en caso de error
    return { desayuno: 0, comida: 0, cena: 0, otro: 0, total: 0 };
  }
};

// Función para obtener los consumos del día con detalles completos
export const fetchConsumosDelDiaConDetalles = async (): Promise<ConsumoConDetalles[]> => {
  try {
    // Fecha actual en formato YYYY-MM-DD para comparar
    const hoy = new Date().toISOString().split('T')[0];
    console.log("Buscando consumos para la fecha:", hoy);
    
    // Obtenemos datos de las tres entidades necesarias
    const [consumosData, empleadosData, comidasData] = await Promise.all([
      fetchConsumos(),
      fetchEmpleados(),
      fetchComida()
    ]);
    
    // Si alguna llamada falló, devolvemos un array vacío
    if (!consumosData || !empleadosData || !comidasData) {
      console.error("No se pudieron obtener los datos necesarios");
      return [];
    }
    
    // Filtramos los consumos para obtener solo los de hoy
    interface ConsumoHoy extends Consumo {}

    const consumosHoy: ConsumoHoy[] = consumosData.filter((consumo: Consumo) => {
      const fechaConsumo: Date = new Date(consumo.Fecha);
      const fechaStr: string = fechaConsumo.toISOString().split('T')[0];
      return fechaStr === hoy;
    });
    
    console.log(`Se encontraron ${consumosHoy.length} consumos para hoy`);
    
    // Combinamos la información para cada consumo
    const consumosDetallados = consumosHoy.map((consumo: Consumo) => {
      const empleado: Empleado | undefined = empleadosData.find((e: Empleado) => e.Id_Empleado === consumo.ID_Empleado);
      const comida: Comida | undefined = comidasData.find((c: Comida) => c.ID_Comida === consumo.ID_Comida);
      
      return {
        ...consumo,
        nombreEmpleado: empleado?.Nombre || 'Empleado desconocido',
        departamentoEmpleado: empleado?.Departamento || 'Departamento desconocido',
        Imagen: empleado?.Imagen || 'default.jpg',
        nombreComida: comida?.Nombre || 'Comida desconocida',
        tipoComida: comida?.Tipo || 'Tipo desconocido',
        precioComida: comida?.Precio || 0
      };
    });
    
    // Ordenamos por fecha descendente (los más recientes primero)
    return consumosDetallados.sort((a, b) => 
      new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
    );
  } catch (error) {
    console.error("Error obteniendo consumos del día:", error);
    return [];
  }
};

// Función para determinar el tipo de comida según la hora actual
export const determinarTipoComida = () => {
  const hora = new Date().getHours();
  
  if (hora >= 6 && hora < 11) {
    return "desayuno";
  } else if (hora >= 12 && hora < 16) {
    return "comida";
  } else if (hora >= 18 && hora < 21) {
    return "cena";
  } else {
    return "otro";
  }
};

// NUEVAS FUNCIONES PARA MEJORAR LA VISUALIZACIÓN DE CONSUMOS RECIENTES

// Función para obtener consumos con detalles completos (empleado y comida)
export const fetchConsumosDetallados = async (): Promise<ConsumoConDetalles[]> => {
  try {
    // Obtenemos datos de las tres entidades
    const [consumosData, empleadosData, comidasData] = await Promise.all([
      fetchConsumos(),
      fetchEmpleados(),
      fetchComida()
    ]);

    // Si alguna llamada falló, devolvemos un array vacío
    if (!consumosData || !empleadosData || !comidasData) {
      return [];
    }

    // Combinamos la información
    const consumosDetallados = consumosData.map((consumo: Consumo) => {
      const empleado: Empleado | undefined = empleadosData.find((e: Empleado) => e.Id_Empleado === consumo.ID_Empleado);
      const comida: Comida | undefined = comidasData.find((c: Comida) => c.ID_Comida === consumo.ID_Comida);
      
      return {
        ...consumo,
        nombreEmpleado: empleado?.Nombre || 'Empleado desconocido',
        departamentoEmpleado: empleado?.Departamento || 'Departamento desconocido',
        nombreComida: comida?.Nombre || 'Comida desconocida',
        tipoComida: comida?.Tipo || 'Tipo desconocido'
      };
    });

    // Ordenamos por fecha descendente (los más recientes primero)
    return consumosDetallados.sort(
      (a: ConsumoConDetalles, b: ConsumoConDetalles) =>
      new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
    );
  } catch (error) {
    console.error("Error obteniendo consumos detallados:", error);
    return [];
  }
};

// Función para obtener consumos con detalles desde el endpoint empleado/consumos
export const fetchConsumosConEmpleados = async (): Promise<ConsumoConDetalles[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/empleado/consumos`
    );
    
    console.log("Respuesta del servidor (empleado/consumos):", response.data);
    
    // Adaptamos la respuesta a nuestro tipo ConsumoConDetalles
    // La estructura puede variar dependiendo de cómo esté configurada la API
    interface ConsumoEmpleadoAPI {
      Id_Consumo?: number;
      ID_Consumo?: number;
      ID_Comida: number;
      ID_Empleado: number;
      Imagen: string;
      Fecha: string;
      Precio?: number | string;
      Nombre_Empleado?: string;
      NombreEmpleado?: string;
      Nombre?: string;
      Departamento?: string;
      Nombre_Comida?: string;
      NombreComida?: string;
      Tipo_Comida?: string;
      TipoComida?: string;
      Tipo?: string;
    }

    interface ConsumoConDetalles {
      Id_Consumo: number;
      ID_Comida: number;
      ID_Empleado: number;
      Imagen: string;
      Fecha: string;
      Precio: number | string;
      nombreEmpleado?: string;
      departamentoEmpleado?: string;
      nombreComida?: string;
      tipoComida?: string;
    }

    const consumosDetallados: ConsumoConDetalles[] = (response.data as ConsumoEmpleadoAPI[]).map((item: ConsumoEmpleadoAPI): ConsumoConDetalles => ({
      Id_Consumo: (typeof item.Id_Consumo === "number" ? item.Id_Consumo : (typeof item.ID_Consumo === "number" ? item.ID_Consumo : 0)),
      ID_Comida: item.ID_Comida,
      ID_Empleado: item.ID_Empleado,
      Fecha: item.Fecha,
      Precio: typeof item.Precio === "undefined" ? "0" : String(item.Precio ?? "0"),
      nombreEmpleado: item.Nombre_Empleado || item.NombreEmpleado || item.Nombre,
      departamentoEmpleado: item.Departamento,
      nombreComida: item.Nombre_Comida || item.NombreComida,
      tipoComida: item.Tipo_Comida || item.TipoComida || item.Tipo,
      Imagen: item.Imagen || "default.jpg"
    }));
    
    // Solo para depuración
    console.log("Consumos detallados después del mapeo:", consumosDetallados[0]);
    
    // Ordenamos por fecha descendente
    // Convertimos Precio a string para cumplir con el tipo ConsumoConDetalles
    const consumosDetalladosConPrecioString = consumosDetallados.map((c) => ({
      ...c,
      Precio: String(c.Precio ?? "0"),
    }));

    return consumosDetalladosConPrecioString.sort(
      (a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
    );
  } catch (error) {
    console.error("Error obteniendo consumos con empleados:", error);
    return [];
  }
};

// Función auxiliar para formatear fechas
export const formatearFecha = (fechaISO: string): string => {
  // Crear la fecha a partir del string ISO
  const fecha = new Date(fechaISO);
  
  // Sumar 7 horas para ajustar la diferencia de zona horaria
  fecha.setHours(fecha.getHours() + 7);
  
  // Formatear la hora ajustada
  return fecha.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};