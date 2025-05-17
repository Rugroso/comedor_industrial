"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Clock1 } from "lucide-react"
import Layout from "@/components/layout"

export default function Visualizacion() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const now = new Date()
    const day = now.getDate().toString().padStart(2, "0")
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const year = now.getFullYear()
    setCurrentDate(`${day}/${month}/${year}`)
  }, [])

  return (
    <Layout title="Registro de empleados">
      <Card className="rounded-xl border-[#cac4d0] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-4">Consumos del día</h2>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#49454f]">
              <Calendar className="h-5 w-5" />
              <span>Fecha: {currentDate}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3edf7] text-left">
                <th className="px-4 py-3 text-[#49454f] font-medium">Foto</th>
                <th className="px-4 py-3 text-[#49454f] font-medium">Nombre</th>
                <th className="px-4 py-3 text-[#49454f] font-medium">No. Empleado</th>
                <th className="px-4 py-3 text-[#49454f] font-medium">Tipo</th>
                <th className="px-4 py-3 text-[#49454f] font-medium">Precio</th>
                <th className="px-4 py-3 text-[#49454f] font-medium">Hora</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Juan Perez", id: "M0411111", time: "8:15 AM" },
                { name: "Maria Lopez", id: "M0411112", time: "8:20 AM" },
                { name: "Luis Rodriguez", id: "M0411113", time: "8:23 AM" },
                { name: "Alberto Gómez", id: "M0411114", time: "9:00 AM" },
                { name: "Maria Becerra", id: "M0411115", time: "9:30 AM" },
              ].map((employee, index) => (
                <tr key={index} className={index < 4 ? "border-b border-[#cac4d0]" : ""}>
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 bg-[#e8def8] rounded-full"></div>
                  </td>
                  <td className="px-4 py-3 text-[#1d1b20]">{employee.name}</td>
                  <td className="px-4 py-3 text-[#1d1b20]">{employee.id}</td>
                  <td className="px-4 py-3 text-[#1d1b20]">Desayuno</td>
                  <td className="px-4 py-3 text-[#1d1b20]">$45.00</td>
                  <td className="px-4 py-3 text-[#1d1b20]">{employee.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-[#49454f]">Mostrando 5 de 35 consumos</p>

          <div className="flex gap-2">
            <Button variant="outline" className="text-[#49454f]">
              Cancelar
            </Button>
            <Button className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]">Registrar empleado</Button>
          </div>
        </div>
      </Card>
    </Layout>
  )
}
