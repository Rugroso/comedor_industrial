"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Layout from "@/components/layout"

export default function RegistroConsumo() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const ampm = now.getHours() >= 12 ? "PM" : "AM"
      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout title="Registro de consumo">
      <div className="flex justify-center">
        <Card className="max-w-xl w-full rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-4">Registro de consumo</h2>

          <p className="text-[#49454f] mb-6">Ingrese el número de empleado para registrar el consumo.</p>

          <p className="text-[#49454f] mb-6">
            El sistema detectará automáticamente si es desayuno o comida según la hora actual.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="employeeNumber" className="block text-[#49454f] mb-2">
                Numero de empleado
              </label>
              <Input id="employeeNumber" placeholder="Ej. M041930" className="border-[#cac4d0] bg-white" />
            </div>

            <div className="flex items-center gap-2 text-[#49454f]">
              <Clock className="h-5 w-5" />
              <span>Hora actual: {currentTime}</span>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]">Registrar consumo</Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
