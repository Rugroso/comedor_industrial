"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import Layout from "@/components/layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { obtenerComidasPorHora, registrarConsumo, determinarTipoComida } from "@/lib/backFunctions"

export default function RegistroConsumo() {
  const [currentTime, setCurrentTime] = useState("")
  const [empleadoId, setEmpleadoId] = useState("")
  const [comidas, setComidas] = useState([])
  const [comidaSeleccionada, setComidaSeleccionada] = useState("")
  const [cargando, setCargando] = useState(false)
  const [alerta, setAlerta] = useState(null)
  const [tipoComida, setTipoComida] = useState("")
  
  // Actualizar la hora actual
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const ampm = now.getHours() >= 12 ? "PM" : "AM"
      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`)
      
      // Actualizar tipo de comida
      setTipoComida(determinarTipoComida())
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Obtener comidas disponibles
  useEffect(() => {
    const fetchComidas = async () => {
      try {
        const comidasData = await obtenerComidasPorHora();
        if (comidasData && Array.isArray(comidasData)) {
          // Filtrar por tipo de comida actual si es necesario
          const comidasFiltradas = comidasData;
          setComidas(comidasFiltradas.length > 0 ? comidasFiltradas : comidasData);
        }
      } catch (error) {
        console.error("Error al cargar comidas:", error);
      }
    };
    
    if (tipoComida) {
      fetchComidas();
    }
  }, [tipoComida]);
  
  // Manejar el registro de consumo
  const handleRegistrarConsumo = async () => {
    // Validar campos
    if (!empleadoId.trim()) {
      setAlerta({
        tipo: "error",
        mensaje: "Por favor ingrese un número de empleado válido."
      });
      return;
    }
    
    if (!comidaSeleccionada) {
      setAlerta({
        tipo: "error",
        mensaje: "Por favor seleccione una comida."
      });
      return;
    }
    
    setCargando(true);
    
    try {
      const resultado = await registrarConsumo(empleadoId, parseInt(comidaSeleccionada));
      
      if (resultado.success) {
        setAlerta({
          tipo: "exito",
          mensaje: "Consumo registrado con éxito."
        });
        
        // Limpiar campos
        setEmpleadoId("");
        setComidaSeleccionada("");
      } else {
        setAlerta({
          tipo: "error",
          mensaje: resultado.message || "Error al registrar el consumo."
        });
      }
    } catch (error) {
      setAlerta({
        tipo: "error",
        mensaje: "Error al procesar la solicitud."
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout title="Registro de consumo">
      <div className="flex justify-center">
        <Card className="max-w-xl w-full rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-4">Registro de consumo</h2>
          <p className="text-[#49454f] mb-6">Ingrese el número de empleado para registrar el consumo.</p>
          <p className="text-[#49454f] mb-6">
            El sistema detectará automáticamente si es desayuno o comida según la hora actual.
          </p>
          
          {alerta && (
            <Alert className={`mb-4 ${alerta.tipo === "exito" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {alerta.tipo === "exito" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={alerta.tipo === "exito" ? "text-green-800" : "text-red-800"}>
                {alerta.tipo === "exito" ? "Éxito" : "Error"}
              </AlertTitle>
              <AlertDescription className={alerta.tipo === "exito" ? "text-green-700" : "text-red-700"}>
                {alerta.mensaje}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="employeeNumber" className="block text-[#49454f] mb-2">
                Número de empleado
              </label>
              <Input 
                id="employeeNumber" 
                placeholder="Ej. M041930" 
                className="border-[#cac4d0] bg-white"
                value={empleadoId}
                onChange={(e) => setEmpleadoId(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="foodSelect" className="block text-[#49454f] mb-2">
                Seleccione la comida ({tipoComida})
              </label>
              <Select 
                value={comidaSeleccionada} 
                onValueChange={setComidaSeleccionada}
              >
                <SelectTrigger id="foodSelect" className="border-[#cac4d0] bg-white">
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {comidas.length > 0 ? (
                    comidas.map((comida) => (
                      <SelectItem key={comida.Id_Comida} value={String(comida.Id_Comida)}>
                        {comida.Nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-disponible" disabled>
                      No hay opciones disponibles en este momento
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 text-[#49454f]">
              <Clock className="h-5 w-5" />
              <span>Hora actual: {currentTime}</span>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]"
                onClick={handleRegistrarConsumo}
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "Registrar consumo"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}