import axios from "axios"
import { Comida, Consumo, Empleado, ConsumoConDetalles } from "./types"

const API_BASE_URL = "/api";

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
    const response = await fetch(`${API_BASE_URL}/comidas/hora`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
export const buscarEmpleado = async (empleadoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}empleado/consumos?id=${empleadoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Empleado no encontrado');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Función para registrar un consumo
export const registrarConsumo = async (idEmpleado, idComida) => {
  try {
    const fecha = new Date().toISOString();
    
    const consumoData = {
      Id_Empleado: idEmpleado,
      Id_Comida: idComida,
      Fecha: fecha
    };
    
    const response = await fetch(`${API_BASE_URL}/consumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consumoData),
    });
    
    if (!response.ok) {
      throw new Error('Error al registrar consumo');
    }
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: error.message
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

// Función para obtener reporte detallado por fecha
export const fetchReporteDetallado = async (fecha: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reportes/detallado?fecha=${fecha}`
    );
    console.log("Datos de reporte detallado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reporte detallado:", error);
    throw error;
  }
};

// Función para obtener reporte ejecutivo mensual
export const fetchReporteEjecutivo = async (mes: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reportes/ejecutivo?mes=${mes}`
    );
    console.log("Datos de reporte ejecutivo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reporte ejecutivo:", error);
    throw error;
  }
};

// Función para obtener reporte del día
export const fetchReporteDia = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reportes/dia`
    );
    console.log("Datos de reporte del día:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reporte del día:", error);
    throw error;
  }
};

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
    const consumosHoy = consumosData.filter(consumo => {
      const fechaConsumo = new Date(consumo.Fecha);
      const fechaStr = fechaConsumo.toISOString().split('T')[0];
      return fechaStr === hoy;
    });
    
    console.log(`Se encontraron ${consumosHoy.length} consumos para hoy`);
    
    // Combinamos la información para cada consumo
    const consumosDetallados = consumosHoy.map((consumo: Consumo) => {
      const empleado = empleadosData.find(e => e.Id_Empleado === consumo.ID_Empleado);
      const comida = comidasData.find(c => c.ID_Comida === consumo.ID_Comida);
      
      return {
        ...consumo,
        nombreEmpleado: empleado?.Nombre || 'Empleado desconocido',
        departamentoEmpleado: empleado?.Departamento || 'Departamento desconocido',
        imagenEmpleado: empleado?.Imagen || 'default.jpg',
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
      const empleado = empleadosData.find(e => e.Id_Empleado === consumo.ID_Empleado);
      const comida = comidasData.find(c => c.ID_Comida === consumo.ID_Comida);
      
      return {
        ...consumo,
        nombreEmpleado: empleado?.Nombre || 'Empleado desconocido',
        departamentoEmpleado: empleado?.Departamento || 'Departamento desconocido',
        nombreComida: comida?.Nombre || 'Comida desconocida',
        tipoComida: comida?.Tipo || 'Tipo desconocido'
      };
    });

    // Ordenamos por fecha descendente (los más recientes primero)
    return consumosDetallados.sort((a, b) => 
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
    const consumosDetallados = response.data.map(item => ({
      Id_Consumo: item.Id_Consumo || item.ID_Consumo,
      ID_Comida: item.ID_Comida,
      ID_Empleado: item.ID_Empleado,
      Fecha: item.Fecha,
      Precio: item.Precio || "0",
      nombreEmpleado: item.Nombre_Empleado || item.NombreEmpleado || item.Nombre,
      departamentoEmpleado: item.Departamento,
      nombreComida: item.Nombre_Comida || item.NombreComida,
      tipoComida: item.Tipo_Comida || item.TipoComida || item.Tipo
    }));
    
    // Solo para depuración
    console.log("Consumos detallados después del mapeo:", consumosDetallados[0]);
    
    // Ordenamos por fecha descendente
    return consumosDetallados.sort((a, b) => 
      new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
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