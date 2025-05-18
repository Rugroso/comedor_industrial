"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, ChevronLeft, ChevronRight, Clock} from "lucide-react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/layout"
import { 
  fetchConsumosDia,
  fetchEmpleados,
  fetchComida,
  formatearFecha 
} from "@/lib/backFunctions"
import { Empleado, Comida, ConsumoDia } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"


export default function Visualizacion() {
  const [currentDate, setCurrentDate] = useState("")
  const [consumosDelDia, setConsumosDelDia] = useState<ConsumoDia[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [comidas, setComidas] = useState<Comida[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTime, setCurrentTime] = useState("")
  const itemsPerPage = 5 // Cambiado a 5 elementos por página
  
  const { toast } = useToast()

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

  useEffect(() => {
    const now = new Date()
    const day = now.getDate().toString().padStart(2, "0")
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const year = now.getFullYear()
    setCurrentDate(`${day}/${month}/${year}`)
    
    cargarDatos()
    
    const interval = setInterval(() => {
      cargarDatos()
    }, 10000) // 10 segundos
    
    return () => clearInterval(interval)
  }, [])
  
  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Cargamos los datos del día, empleados y comidas en paralelo
      const [consumosDiaData, empleadosData, comidasData] = await Promise.all([
        fetchConsumosDia(),
        fetchEmpleados(),
        fetchComida()
      ])
      
      console.log("Datos obtenidos del endpoint /consumos/dia:", consumosDiaData);
      
      setConsumosDelDia(consumosDiaData || [])
      setEmpleados(empleadosData || [])
      setComidas(comidasData || [])
      setError("")
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("Error al cargar los consumos del día")
      toast({
        title: "Error",
        description: "No se pudieron cargar los consumos del día",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Función para obtener el nombre del empleado
  const getNombreEmpleado = (id?: number) => {
    if (!id) return 'Desconocido';
    const empleado = empleados.find(e => e.Id_Empleado === id);
    return empleado?.Nombre || 'Desconocido';
  }
  
  // Función para obtener el departamento del empleado
  const getDepartamentoEmpleado = (id?: number) => {
    if (!id) return '-';
    const empleado = empleados.find(e => e.Id_Empleado === id);
    return empleado?.Departamento || '-';
  }
  
  // Función para obtener el nombre de la comida
  const getNombreComida = (id?: number) => {
    if (!id) return 'Desconocido';
    const comida = comidas.find(c => c.ID_Comida === id);
    return comida?.Nombre || 'Desconocido';
  }
  
  // Función para obtener el tipo de comida
  const getTipoComida = (id?: number) => {
    if (!id) return 'Desconocido';
    const comida = comidas.find(c => c.ID_Comida === id);
    return comida?.Tipo || 'Desconocido';
  }
  
  // Función para extraer directamente del objeto de consumo si ya contiene la info
  const obtenerInfoComida = (consumo: ConsumoDia) => {
    // Intentamos obtener el ID de comida
    const idComida = consumo.ID_Comida || consumo.Id_Comida;
    
    // Nombres posibles para el nombre y tipo de comida en el objeto
    const nombreComidaDirecto = consumo.Nombre_Comida || consumo.nombre_comida || 
                           consumo.NombreComida || consumo.nombreComida;
    
    const tipoComidaDirecto = consumo.Tipo_Comida || consumo.tipo_comida || 
                         consumo.TipoComida || consumo.tipoComida || 
                         consumo.Tipo || consumo.tipo;
    
    // Si tenemos info directa, la usamos
    if (nombreComidaDirecto || tipoComidaDirecto) {
      return {
        nombre: nombreComidaDirecto || (idComida ? getNombreComida(idComida) : 'Desconocido'),
        tipo: tipoComidaDirecto || (idComida ? getTipoComida(idComida) : 'Desconocido')
      };
    }
    
    // Si no, buscamos por ID
    if (idComida) {
      return {
        nombre: getNombreComida(idComida),
        tipo: getTipoComida(idComida)
      };
    }
    
    return {
      nombre: 'Desconocido',
      tipo: 'Desconocido'
    };
  }
  
  // Ordenar consumos por fecha descendente (más recientes primero)
  const consumosOrdenados = [...consumosDelDia].sort((a, b) => {
    const fechaA = new Date(a.Fecha || a.fecha || '');
    const fechaB = new Date(b.Fecha || b.fecha || '');
    return fechaB.getTime() - fechaA.getTime();
  });
  
  // Calcular páginas
  const totalPages = Math.max(1, Math.ceil(consumosOrdenados.length / itemsPerPage));
  
  // Obtener consumos para la página actual
  const consumosPaginados = consumosOrdenados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Cambiar de página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Layout title="Visualización de Consumos">
      <Card className="rounded-xl border-[#cac4d0] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-4">Consumos del día</h2>
          <div className="flex items-center gap-2 text-[#49454f]">
            <Calendar className="h-5 w-5" />
            <span>Fecha: {currentDate}</span>
            <div className="flex items-center gap-2 text-[#49454f] ml-4">
              <Clock className="h-5 w-5" />
              <span>Hora actual: {currentTime}</span>
            </div>
          </div>
            <div className="flex items-center gap-2 text-[#49454f] mt-2">
              <span className="text-sm">Actualización automática cada 10 segundos</span>
            </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10 text-[#79747e]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#dca8e4] mr-2"></div>
            Cargando consumos del día...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-10 text-red-500">
            {error}
          </div>
        ) : consumosDelDia.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-[#79747e]">
            No hay consumos registrados para hoy
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#cac4d0] text-left">
                    <th className="pb-2 text-[#49454f]">Foto</th>
                    <th className="pb-2 text-[#49454f]">Empleado</th>
                    <th className="pb-2 text-[#49454f]">Departamento</th>
                    <th className="pb-2 text-[#49454f]">Comida</th>
                    <th className="pb-2 text-[#49454f]">Tipo</th>
                    <th className="pb-2 text-[#49454f]">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {consumosPaginados.map((consumo, index) => {
                    const idEmpleado = consumo.ID_Empleado || consumo.Id_Empleado;
                    const fecha = consumo.Fecha || consumo.fecha || '';
                    
                    const nombreEmpleado = getNombreEmpleado(idEmpleado);
                    const departamentoEmpleado = getDepartamentoEmpleado(idEmpleado);
                    const infoComida = obtenerInfoComida(consumo);
                    
                    return (
                      <tr 
                        key={consumo.ID_Consumo || consumo.Id_Consumo || index} 
                        className={index < consumosPaginados.length - 1 ? "border-b border-[#cac4d0]" : ""}
                      >
                        <td className="py-3">
                          <img 
                            src={empleados.find(e => e.Id_Empleado === idEmpleado)?.Imagen || './userPlaceholder.png'} 
                            alt={nombreEmpleado} 
                            onError={(e) => {
                              e.currentTarget.src = './userPlaceholder.png';
                            }}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"

                          />
                        </td>
                        <td className="py-3 text-[#1d1b20]">{nombreEmpleado}</td>
                        <td className="py-3 text-[#49454f] text-sm">{departamentoEmpleado}</td>
                        <td className="py-3 text-[#1d1b20]">{infoComida.nombre}</td>
                        <td className="py-3 text-[#1d1b20]">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            (infoComida.tipo || '').toLowerCase() === 'desayuno' ? 'bg-blue-100 text-blue-800' :
                            (infoComida.tipo || '').toLowerCase() === 'comida' ? 'bg-green-100 text-green-800' :
                            (infoComida.tipo || '').toLowerCase() === 'cena' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {infoComida.tipo}
                          </span>
                        </td>
                        <td className="py-3 text-[#1d1b20]">{formatearFecha(fecha)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center">
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Si hay más de 5 páginas, mostrar de forma inteligente alrededor de la página actual
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button 
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'bg-[#dca8e4] text-[#1d1b20] hover:bg-[#c794d1]' : ''}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </Layout>
  )
}