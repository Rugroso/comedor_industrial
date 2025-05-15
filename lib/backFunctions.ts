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
      `https://h866jjo9h8.execute-api.us-east-2.amazonaws.com/api/empleados/${id}`,
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