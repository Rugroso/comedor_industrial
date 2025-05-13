import axios from "axios"
import { Comida, Consumo, Empleado } from "./types"

    export const fetchComida = async () => {
      try {
        const response = await axios.get(
          "https://h866jjo9h8.execute-api.us-east-2.amazonaws.com/api/comidas"
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
          "https://h866jjo9h8.execute-api.us-east-2.amazonaws.com/api/empleados"
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
        "https://h866jjo9h8.execute-api.us-east-2.amazonaws.com/api/consumos"
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