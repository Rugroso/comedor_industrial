"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"

export default function RegistroEmpleados() {
  return (
    <Layout title="Registro de empleados">
      <div className="space-y-8">
        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">Registro de nuevo empleado</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-[#49454f] mb-2">
                Nombre completo
              </label>
              <Input id="fullName" className="border-[#cac4d0] bg-white" />
            </div>

            <div>
              <label htmlFor="employeeNumber" className="block text-[#49454f] mb-2">
                Numero de empleado
              </label>
              <Input id="employeeNumber" className="border-[#cac4d0] bg-white" />
            </div>

            <div>
              <label htmlFor="department" className="block text-[#49454f] mb-2">
                Departamento
              </label>
              <Select>
                <SelectTrigger className="border-[#cac4d0] bg-white">
                  <SelectValue placeholder="Selecciona departamento..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="finanzas">Finanzas</SelectItem>
                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="photo" className="block text-[#49454f] mb-2">
                Fotografía
              </label>
              <div className="border border-[#cac4d0] rounded-md p-4 bg-white">
                <Button variant="outline" className="text-[#49454f]">
                  Choose File
                </Button>
                <p className="text-xs text-[#79747e] mt-2">Tamaño máximo: 1.5 MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" className="text-[#49454f]">
                Cancelar
              </Button>
              <Button className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]">Registrar empleado</Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">Empleados recientes</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f3edf7] text-left">
                  <th className="px-4 py-3 text-[#49454f] font-medium rounded-l-md">Nombre</th>
                  <th className="px-4 py-3 text-[#49454f] font-medium">No. Empleado</th>
                  <th className="px-4 py-3 text-[#49454f] font-medium">Departamento</th>
                  <th className="px-4 py-3 text-[#49454f] font-medium rounded-r-md">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#cac4d0]">
                  <td className="px-4 py-3 text-[#1d1b20]">Juan Perez</td>
                  <td className="px-4 py-3 text-[#1d1b20]">M041213</td>
                  <td className="px-4 py-3 text-[#1d1b20]">IT</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a href="#" className="block text-blue-500 hover:underline">
                        Editar
                      </a>
                      <a href="#" className="block text-red-500 hover:underline">
                        Eliminar
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#1d1b20]">Olivia Ramos</td>
                  <td className="px-4 py-3 text-[#1d1b20]">M014853</td>
                  <td className="px-4 py-3 text-[#1d1b20]">Finanzas</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a href="#" className="block text-blue-500 hover:underline">
                        Editar
                      </a>
                      <a href="#" className="block text-red-500 hover:underline">
                        Eliminar
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
