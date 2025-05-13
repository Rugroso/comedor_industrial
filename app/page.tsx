"use client"

import { Users, Utensils } from "lucide-react"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layout"
import { Comida, Empleado, Consumo } from "@/lib/types"
import { use, useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard() {
  const [loadingComida, setLoadingComida] = useState(true)
  const [loadingEmpleados, setLoadingEmpleados] = useState(true)
  const [loadingConsumos, setLoadingConsumos] = useState(true)
  const [comida, setComida] = useState<Comida[]>([])
  const [empleados, setEmpleados] = useState<Comida[]>([])
  const [consumos, setConsumos] = useState<Comida[]>([])


  useEffect(() => { 

    const fetchComida = async () => {
      setLoadingComida(true)
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
        setComida(comidaData)
        setLoadingComida(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoadingComida(false)
      }
    }
    fetchComida()
  }, [])

  useEffect(() => { 

    const fetchEmpleados = async () => {
      setLoadingEmpleados(true)
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
        setEmpleados(empleadosData)
        setLoadingEmpleados(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoadingEmpleados(false)
      }
    }
    fetchEmpleados()
  }, [])

  useEffect(() => {
  const fetchConsumos = async () => {
    setLoadingConsumos(true)
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
      console.log(consumosData)
      setConsumos(consumosData)
      setLoadingConsumos(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoadingConsumos(false)
    }
  }
  fetchConsumos()
}, [])

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Utensils className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Total desayunos hoy</p>
              {loadingComida ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">
                  {comida.filter((item) => item.Tipo === "desayuno").length}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Utensils className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Total comidas hoy</p>
              <p className="text-2xl font-bold text-[#1d1b20]">42</p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Users className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Empleados registrados</p>
              <p className="text-2xl font-bold text-[#1d1b20]">128</p>
            </div>
          </div>
        </Card>

        {/* Graph Section */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-6">
          <h2 className="mb-6 text-lg font-medium text-[#1d1b20]">Empleados registrados</h2>
          <div className="flex h-48 items-center justify-center text-[#79747e]">
            [Grafico de consumos por departamento]
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-6">
          <h2 className="mb-6 text-lg font-medium text-[#1d1b20]">Consumos recientes</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#cac4d0] text-left">
                <th className="pb-2 text-[#49454f]">Empleado</th>
                <th className="pb-2 text-[#49454f]">Tipo</th>
                <th className="pb-2 text-[#49454f]">Hora</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#cac4d0]">
                <td className="py-3 text-[#1d1b20]">Juan Perez</td>
                <td className="py-3 text-[#1d1b20]">Desayuno</td>
                <td className="py-3 text-[#1d1b20]">8:15 AM</td>
              </tr>
              <tr>
                <td className="py-3 text-[#1d1b20]">Maria Gómez</td>
                <td className="py-3 text-[#1d1b20]">Comida</td>
                <td className="py-3 text-[#1d1b20]">8:20 AM</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  )
}
