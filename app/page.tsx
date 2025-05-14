"use client"

import { Users, Utensils } from "lucide-react"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layout"
import { Comida, Empleado, Consumo } from "@/lib/types"
import GraficoConsumosPorDepartamento from "@/components/ConsumoDepartamento"
import { fetchComida, fetchEmpleados, fetchConsumos } from "@/lib/backFunctions"
import { useEffect, useState } from "react"


export default function Dashboard() {
  const [loadingComida, setLoadingComida] = useState(true)
  const [loadingEmpleados, setLoadingEmpleados] = useState(true)
  const [loadingConsumos, setLoadingConsumos] = useState(true)
  const [comida, setComida] = useState<Comida[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [consumos, setConsumos] = useState<Consumo[]>([])
  const [totalEmpleados, setTotalEmpleados] = useState(0)


  useEffect(() => { 
     fetchComida().then((data) => {
      setComida(data)
      setLoadingComida(false)
    }).catch((error) => {
      console.error("Error fetching comida:", error)
      setLoadingComida(false)
    }
    )
  }, [])

  useEffect(() => { 
    fetchEmpleados().then((data) => {
      setEmpleados(data)
      setTotalEmpleados(data ? data.length : 0)
      setLoadingEmpleados(false)
    }
    ).catch((error) => {  
      console.error("Error fetching empleados:", error)
      setLoadingEmpleados(false)
    }
    )
  }, []);

  useEffect(() => {
    fetchConsumos().then((data) => {
      setConsumos(data)
      setLoadingConsumos(false)
    }
    ).catch((error) => {
      console.error("Error fetching consumos:", error)
      setLoadingConsumos(false)
    }
    )
  }, [])

  const getTotalComidasPorTipo = (tipo) => {
    if (loadingComida || !comida || comida.length === 0) return 0;
    return comida.filter((item) => item.Tipo === tipo).length;
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Utensils className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              {/* TOTAL DESAYUNOS */}
              <p className="text-sm text-[#49454f]">Total desayunos hoy</p>
              {loadingComida ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">
                  {getTotalComidasPorTipo("desayuno")}
                </p>
              )}
            </div>
          </div>
        </Card>

              {/* TOTAL COMIDAS */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Utensils className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Total comidas hoy</p>
              {loadingComida ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">
                  {getTotalComidasPorTipo("comida")}
                </p>
              )}
            </div>
          </div>
        </Card>

             {/* TOTAL EMPLEADOS */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dca8e4]">
              <Users className="h-6 w-6 text-[#1d1b20]" />
            </div>
            <div>
              <p className="text-sm text-[#49454f]">Empleados registrados</p>
              {loadingEmpleados ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">{totalEmpleados}</p>
              )}
            </div>
          </div>
        </Card>

        {/* GRAFICO DE CONSUMOS POR DEPARTAMENTOS */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-6">
          <h2 className="mb-6 text-lg font-medium text-[#1d1b20]">Consumos por departamento</h2>
          {loadingConsumos || loadingEmpleados ? (
            <div className="flex h-48 items-center justify-center text-[#79747e]">
              Cargando datos del gráfico...
            </div>
          ) : (
            <GraficoConsumosPorDepartamento 
              consumos={consumos} 
              empleados={empleados} 
            />
          )}
        </Card>
          
          {/* APARTADO DE CONSUMOS RECIENTES */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-6">
          <h2 className="mb-6 text-lg font-medium text-[#1d1b20]">Consumos recientes</h2>
          {loadingConsumos ? (
            <div className="flex items-center justify-center py-10 text-[#79747e]">
              Cargando consumos recientes...
            </div>
          ) : consumos.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[#79747e]">
              No hay consumos registrados
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#cac4d0] text-left">
                  <th className="pb-2 text-[#49454f]">Empleado</th>
                  <th className="pb-2 text-[#49454f]">Tipo</th>
                  <th className="pb-2 text-[#49454f]">Hora</th>
                </tr>
              </thead>
              <tbody>
                {consumos.slice(0, 5).map((consumo, index) => {
                  const empleado = empleados.find(e => e.Id_Empleado === consumo.ID_Empleado);
                  const comidaItem = comida.find(c => c.ID_Comida === consumo.ID_Comida);
                  
                  const fecha = new Date(consumo.Fecha);
                  const hora = fecha.toLocaleTimeString('es-MX', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  });
                  
                  return (
                    <tr key={consumo.Id_Consumo || index} className={index < consumos.length - 1 ? "border-b border-[#cac4d0]" : ""}>
                      <td className="py-3 text-[#1d1b20]">{empleado ? empleado.Nombre : 'Empleado desconocido'}</td>
                      <td className="py-3 text-[#1d1b20]">{comidaItem ? comidaItem.Tipo : 'Tipo desconocido'}</td>
                      <td className="py-3 text-[#1d1b20]">{hora}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </Layout>
  )
}