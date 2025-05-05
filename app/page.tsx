"use client"

import { Users, Utensils } from "lucide-react"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layout"
import { useEffect } from "react"
import axios from "axios"

export default function Dashboard() {
  
  useEffect(() => { 
    axios.get
      ("https://h866jjo9h8.execute-api.us-east-2.amazonaws.com/api/hello")
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, [])

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Utensils className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Total desayunos hoy</p>
              <p className="text-2xl font-bold text-[#1d1b20]">35</p>
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
