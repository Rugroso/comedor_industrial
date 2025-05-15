import axios from "axios"
import { Comida, Consumo, Empleado } from "./types"

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

export const registrarEmpleado = async (nombre: string, departamento: string, numeroEmpleado: string, imagen: string = "default.jpg") => {
  try {
    console.log("Iniciando registro de empleado:", { nombre, departamento, imagen })
    
    const nuevoEmpleado = {
      "Nombre": nombre,
      "Departamento": departamento,
      "Imagen": imagen
    }
    
    console.log("Enviando datos a la API:", nuevoEmpleado)
    
    const response = await axios.post(
      `${API_BASE_URL}/empleados`,
      nuevoEmpleado,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    
    console.log("Respuesta completa de la API:", response)
    console.log("Empleado registrado:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Error completo:", error)
    
    if (error.response) {
      console.error("Error del servidor:", {
        status: error.response.status,
        data: error.response.data
      })
      throw {
        message: `Error del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        originalError: error
      }
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor")
      throw {
        message: "No se recibió respuesta del servidor. Verifica tu conexión a Internet.",
        originalError: error
      }
    } else {
      console.error("Error al configurar la solicitud:", error.message)
      throw {
        message: `Error al configurar la solicitud: ${error.message}`,
        originalError: error
      }
    }
  }
}

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


//Consumo Empleados
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