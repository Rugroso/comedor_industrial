"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Layout from "@/components/layout"

export default function Reportes() {
  return (
    <Layout title="Generación de reportes">
      <div className="space-y-8">
        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">Generar reportes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[#49454f] mb-4">Tipo de reporte</h3>

              <RadioGroup defaultValue="detallado" className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detallado" id="detallado" />
                  <Label htmlFor="detallado" className="text-[#1d1b20]">
                    Reporte detallado (diario)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ejecutivo" id="ejecutivo" />
                  <Label htmlFor="ejecutivo" className="text-[#1d1b20]">
                    Reporte ejecutivo (mensual)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <label htmlFor="date" className="block text-[#49454f] mb-2">
                Seleccione fecha
              </label>
              <Input id="date" type="text" defaultValue="30/04/2025" className="border-[#cac4d0] bg-white" />
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]">Generar y descargar reportes</Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">Reportes recientes</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f3edf7] text-left">
                  <th className="px-4 py-3 text-[#49454f] font-medium">Fecha</th>
                  <th className="px-4 py-3 text-[#49454f] font-medium">Tipo</th>
                  <th className="px-4 py-3 text-[#49454f] font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "25-04-2025", type: "Detallado" },
                  { date: "25-04-2025", type: "Detallado" },
                  { date: "25-04-2025", type: "Ejecutivo" },
                  { date: "25-04-2025", type: "Ejecutivo" },
                ].map((report, index) => (
                  <tr key={index} className={index < 3 ? "border-b border-[#cac4d0]" : ""}>
                    <td className="px-4 py-3 text-[#1d1b20]">{report.date}</td>
                    <td className="px-4 py-3 text-[#1d1b20]">{report.type}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-500 hover:underline">
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
