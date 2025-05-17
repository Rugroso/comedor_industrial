"use client"

import { Users, Utensils } from "lucide-react"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layout"
import { Comida, Empleado, Consumo, ConsumoConDetalles } from "@/lib/types"
import GraficoConsumosPorDepartamento from "@/components/ConsumoDepartamento"
import { 
  fetchComida, 
  fetchEmpleados, 
  fetchConsumos, 
  fetchConsumosConEmpleados,
  fetchConsumosHoyPorTipo,
  formatearFecha 
} from "@/lib/backFunctions"
import { useEffect, useState } from "react"

// Tipo para los contadores de comidas por tipo
type ConteoComidasPorTipo = {
  desayuno: number;
  comida: number;
  cena: number;
  otro: number;
  total: number;
}

export default function Dashboard() {
  const [loadingComida, setLoadingComida] = useState(true)
  const [loadingEmpleados, setLoadingEmpleados] = useState(true)
  const [loadingConsumos, setLoadingConsumos] = useState(true)
  const [loadingConteos, setLoadingConteos] = useState(true)
  const [comida, setComida] = useState<Comida[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [consumos, setConsumos] = useState<Consumo[]>([])
  const [consumosDetallados, setConsumosDetallados] = useState<ConsumoConDetalles[]>([])
  const [conteosPorTipo, setConteosPorTipo] = useState<ConteoComidasPorTipo>({
    desayuno: 0,
    comida: 0,
    cena: 0,
    otro: 0,
    total: 0
  })
  const [totalEmpleados, setTotalEmpleados] = useState(0)
  const [error, setError] = useState("")

  // Fetch comidas
  useEffect(() => { 
     fetchComida().then((data) => {
      setComida(data)
      setLoadingComida(false)
    }).catch((error) => {
      console.error("Error fetching comida:", error)
      setLoadingComida(false)
    })
  }, [])

  // Fetch empleados
  useEffect(() => { 
    fetchEmpleados().then((data) => {
      setEmpleados(data)
      setTotalEmpleados(data ? data.length : 0)
      setLoadingEmpleados(false)
    }).catch((error) => {  
      console.error("Error fetching empleados:", error)
      setLoadingEmpleados(false)
    })
  }, [])

  // Fetch consumos básicos
  useEffect(() => {
    fetchConsumos().then((data) => {
      setConsumos(data)
      setLoadingConsumos(false)
    }).catch((error) => {
      console.error("Error fetching consumos:", error)
      setLoadingConsumos(false)
    })
  }, [])

  // Fetch consumos detallados
  useEffect(() => {
    setLoadingConsumos(true)
    fetchConsumosConEmpleados()
      .then((data) => {
        setConsumosDetallados(data)
        setLoadingConsumos(false)
      })
      .catch((error) => {
        console.error("Error obteniendo consumos detallados:", error)
        setError("Error al cargar los consumos detallados")
        setLoadingConsumos(false)
      })
  }, [])

  // NUEVO: Fetch conteo de comidas por tipo para hoy
  useEffect(() => {
    setLoadingConteos(true)
    fetchConsumosHoyPorTipo()
      .then((data) => {
        setConteosPorTipo(data)
        setLoadingConteos(false)
      })
      .catch((error) => {
        console.error("Error obteniendo conteo de comidas por tipo:", error)
        setLoadingConteos(false)
      })

    // Refrescar los datos cada 5 minutos
    const interval = setInterval(() => {
      fetchConsumosHoyPorTipo()
        .then((data) => {
          setConteosPorTipo(data)
        })
        .catch((error) => {
          console.error("Error actualizando conteo de comidas por tipo:", error)
        })
    }, 300000) // 5 minutos en milisegundos

    return () => clearInterval(interval)
  }, [])

  // Método anterior (por si acaso necesitamos fallback)
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
              {loadingConteos ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">
                  {conteosPorTipo.desayuno}
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
              {loadingConteos ? (
                <p className="text-2xl font-bold text-[#1d1b20]">Cargando...</p>
              ) : (
                <p className="text-2xl font-bold text-[#1d1b20]">
                  {conteosPorTipo.comida}
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
          <GraficoConsumosPorDepartamento />
        </Card>
          
        {/* APARTADO DE CONSUMOS RECIENTES */}
        <Card className="overflow-hidden rounded-xl border-[#cac4d0] p-6">
          <h2 className="mb-6 text-lg font-medium text-[#1d1b20]">Consumos recientes</h2>
          
          {loadingConsumos ? (
            <div className="flex items-center justify-center py-10 text-[#79747e]">
              Cargando consumos recientes...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10 text-red-500">
              {error}
            </div>
          ) : consumosDetallados.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[#79747e]">
              No hay consumos registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#cac4d0] text-left">
                    <th className="pb-2 text-[#49454f]">Empleado</th>
                    <th className="pb-2 text-[#49454f]">Departamento</th>
                    <th className="pb-2 text-[#49454f]">Comida</th>
                    <th className="pb-2 text-[#49454f]">Tipo</th>
                    <th className="pb-2 text-[#49454f]">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {consumosDetallados.slice(0, 5).map((consumo, index) => (
                    <tr 
                      key={consumo.Id_Consumo || index} 
                      className={index < consumosDetallados.length - 1 ? "border-b border-[#cac4d0]" : ""}
                    >
                      <td className="py-3 text-[#1d1b20]">{consumo.nombreEmpleado || 'Desconocido'}</td>
                      <td className="py-3 text-[#49454f] text-sm">{consumo.departamentoEmpleado || '-'}</td>
                      <td className="py-3 text-[#1d1b20]">{consumo.nombreComida || 'Desconocido'}</td>
                      <td className="py-3 text-[#1d1b20]">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          consumo.tipoComida === 'desayuno' ? 'bg-blue-100 text-blue-800' :
                          consumo.tipoComida === 'comida' ? 'bg-green-100 text-green-800' :
                          consumo.tipoComida === 'cena' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {consumo.tipoComida || 'Desconocido'}
                        </span>
                      </td>
                      <td className="py-3 text-[#1d1b20]">{formatearFecha(consumo.Fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}