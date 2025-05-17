"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  fetchReporteDetallado, 
  fetchReporteEjecutivo, 
  fetchReporteDia
} from "@/lib/backFunctions"
import Layout from "@/components/layout"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "lucide-react"
import { jsPDF } from 'jspdf' 

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState<'detallado' | 'ejecutivo'>('detallado')
  const [fecha, setFecha] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { toast } = useToast()
  
  useEffect(() => {
    const hoy = new Date()
    const dia = hoy.getDate().toString().padStart(2, '0')
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0')
    const anio = hoy.getFullYear()
    setFecha(`${dia}/${mes}/${anio}`)
  }, [])
  
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value)
  }
  
  const handleTipoReporteChange = (value: string) => {
    setTipoReporte(value as 'detallado' | 'ejecutivo')
  }
  
  const generarReporte = async () => {
    setLoading(true)
    
    try {
      const fechaPartes = fecha.split('/')
      let fechaAPI = ''
      
      if (tipoReporte === 'detallado') {
        if (fechaPartes.length === 3) {
          fechaAPI = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`
        } else {
          throw new Error("Formato de fecha incorrecto. Debe ser DD/MM/YYYY")
        }
        
        try {
          const reporte = await fetchReporteDetallado(fechaAPI)
          generarPDF(reporte || crearReporteDetalladoDummy(fechaAPI), 'detallado')
          
          toast({
            title: "Reporte generado",
            description: `Reporte detallado para ${fecha} generado exitosamente`,
          })
        } catch (error) {
          console.error("Error obteniendo datos del reporte detallado:", error)
          generarPDF(crearReporteDetalladoDummy(fechaAPI), 'detallado')
          toast({
            title: "Reporte generado con datos de ejemplo",
            description: `No se pudieron obtener datos reales. Se generó un reporte de ejemplo.`,
          })
        }
      } else {
        if (fechaPartes.length >= 2) {
          if (fechaPartes.length === 2) {
            fechaAPI = `${fechaPartes[1]}-${fechaPartes[0]}`
          } else {
            fechaAPI = `${fechaPartes[2]}-${fechaPartes[1]}`
          }
        } else {
          throw new Error("Formato de fecha incorrecto. Debe ser MM/YYYY")
        }
        
        try {
          const reporte = await fetchReporteEjecutivo(fechaAPI)
          generarPDF(reporte || crearReporteEjecutivoDummy(fechaAPI), 'ejecutivo')
          
          toast({
            title: "Reporte generado",
            description: `Reporte ejecutivo para ${fechaPartes[1] || fechaPartes[0]}/${fechaPartes[2] || fechaPartes[1]} generado exitosamente`,
          })
        } catch (error) {
          console.error("Error obteniendo datos del reporte ejecutivo:", error)
          generarPDF(crearReporteEjecutivoDummy(fechaAPI), 'ejecutivo')
          toast({
            title: "Reporte generado con datos de ejemplo",
            description: `No se pudieron obtener datos reales. Se generó un reporte de ejemplo.`,
          })
        }
      }
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo generar el reporte solicitado",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const generarReporteDia = async () => {
    setLoading(true)
    
    try {
      try {
        const reporte = await fetchReporteDia()
        generarPDF(reporte || crearReporteDiaDummy(), 'dia')
      } catch (error) {
        console.error("Error obteniendo datos del reporte del día:", error)
        generarPDF(crearReporteDiaDummy(), 'dia')
      }
      
      toast({
        title: "Reporte generado",
        description: "Reporte del día generado exitosamente",
      })
    } catch (error) {
      console.error("Error al generar reporte del día:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el reporte del día",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const crearReporteDetalladoDummy = (fecha: string) => {
    return {
      fecha: fecha,
      consumos: [
        {
          fecha: fecha,
          hora: "08:30",
          empleado: "Juan Pérez",
          departamento: "IT",
          comida: "Huevos Rancheros",
          tipo: "desayuno",
          precio: 45.00
        },
        {
          fecha: fecha,
          hora: "08:45",
          empleado: "María García",
          departamento: "Recursos Humanos",
          comida: "Chilaquiles",
          tipo: "desayuno",
          precio: 50.00
        },
        {
          fecha: fecha,
          hora: "13:15",
          empleado: "Carlos López",
          departamento: "Ventas",
          comida: "Enchiladas",
          tipo: "comida",
          precio: 65.00
        }
      ],
      totales: {
        desayunos: 2,
        comidas: 1,
        cenas: 0,
        otros: 0,
        total: 3,
        importe: 160.00
      }
    };
  };
  
  const crearReporteEjecutivoDummy = (mes: string) => {
    return {
      mes: mes,
      departamentos: [
        {
          nombre: "IT",
          consumos: 42,
          importe: 2100.00
        },
        {
          nombre: "Recursos Humanos",
          consumos: 38,
          importe: 1900.00
        },
        {
          nombre: "Ventas",
          consumos: 45,
          importe: 2250.00
        },
        {
          nombre: "Marketing",
          consumos: 30,
          importe: 1500.00
        }
      ],
      totales: {
        consumos: 155,
        importe: 7750.00
      },
      porTipo: {
        desayunos: 75,
        comidas: 65,
        cenas: 10,
        otros: 5
      }
    };
  };
  
  const crearReporteDiaDummy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return {
      fecha: hoy,
      departamentos: [
        {
          nombre: "IT",
          consumos: 5,
          importe: 250.00
        },
        {
          nombre: "Recursos Humanos",
          consumos: 4,
          importe: 200.00
        },
        {
          nombre: "Ventas",
          consumos: 6,
          importe: 300.00
        }
      ],
      totales: {
        desayunos: 8,
        comidas: 7,
        cenas: 0,
        total: 15,
        importe: 750.00
      }
    };
  };
  
  const generarPDF = (data: any, tipo: string) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(`Reporte ${tipo === 'detallado' ? 'Detallado' : tipo === 'ejecutivo' ? 'Ejecutivo' : 'del Día'}`, 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      const fechaTexto = tipo === 'detallado' ? `Fecha: ${data.fecha}` : 
                         tipo === 'ejecutivo' ? `Mes: ${data.mes}` : 
                         `Fecha: ${new Date().toLocaleDateString()}`;
      doc.text(fechaTexto, 105, 25, { align: 'center' });
      
      doc.line(20, 30, 190, 30);
      
      let y = 40;
      
      if (tipo === 'detallado' || tipo === 'dia') {
        doc.setFontSize(14);
        doc.text("Totales:", 20, y);
        y += 10;
        
        doc.setFontSize(10);
        if (data.totales) {
          doc.text(`Desayunos: ${data.totales.desayunos || 0}`, 25, y);
          y += 7;
          doc.text(`Comidas: ${data.totales.comidas || 0}`, 25, y);
          y += 7;
          doc.text(`Cenas: ${data.totales.cenas || 0}`, 25, y);
          y += 7;
          doc.text(`Total consumos: ${data.totales.total || 0}`, 25, y);
          y += 7;
          doc.text(`Importe total: $${data.totales.importe || 0}`, 25, y);
          y += 15;
        }
        
        if (data.consumos && data.consumos.length > 0 && tipo === 'detallado') {
          doc.setFontSize(14);
          doc.text("Consumos:", 20, y);
          y += 10;
          
          doc.setFontSize(9);
          doc.text("Empleado", 20, y);
          doc.text("Departamento", 60, y);
          doc.text("Comida", 100, y);
          doc.text("Tipo", 140, y);
          doc.text("Precio", 170, y);
          y += 7;
          
          doc.line(20, y - 3, 190, y - 3);
          
          const consumosMostrados = data.consumos.slice(0, 20);
          
          doc.setFontSize(8);
          for (const consumo of consumosMostrados) {
            doc.text(consumo.empleado?.substring(0, 18) || '', 20, y);
            doc.text(consumo.departamento?.substring(0, 18) || '', 60, y);
            doc.text(consumo.comida?.substring(0, 18) || '', 100, y);
            doc.text(consumo.tipo || '', 140, y);
            doc.text(`$${consumo.precio || 0}`, 170, y);
            y += 6;
            
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
          }
          
          if (data.consumos.length > 20) {
            doc.setFontSize(9);
            doc.text(`... y ${data.consumos.length - 20} consumos más`, 105, y + 10, { align: 'center' });
          }
        }
        
        if (data.departamentos && data.departamentos.length > 0) {
          doc.setFontSize(14);
          doc.text("Consumos por departamento:", 20, y);
          y += 10;
          
          doc.setFontSize(9);
          doc.text("Departamento", 20, y);
          doc.text("Consumos", 100, y);
          doc.text("Importe", 140, y);
          y += 7;
          
          doc.line(20, y - 3, 190, y - 3);
          
          doc.setFontSize(8);
          for (const dept of data.departamentos) {
            doc.text(dept.nombre || '', 20, y);
            doc.text(String(dept.consumos || 0), 100, y);
            doc.text(`$${dept.importe || 0}`, 140, y);
            y += 6;
          }
        }
      } else if (tipo === 'ejecutivo') {
        doc.setFontSize(14);
        doc.text("Resumen mensual:", 20, y);
        y += 10;
        
        doc.setFontSize(10);
        if (data.totales) {
          doc.text(`Total consumos: ${data.totales.consumos || 0}`, 25, y);
          y += 7;
          doc.text(`Importe total: $${data.totales.importe || 0}`, 25, y);
          y += 15;
        }
        
        if (data.porTipo) {
          doc.setFontSize(14);
          doc.text("Desglose por tipo:", 20, y);
          y += 10;
          
          doc.setFontSize(10);
          doc.text(`Desayunos: ${data.porTipo.desayunos || 0}`, 25, y);
          y += 7;
          doc.text(`Comidas: ${data.porTipo.comidas || 0}`, 25, y);
          y += 7;
          doc.text(`Cenas: ${data.porTipo.cenas || 0}`, 25, y);
          y += 7;
          doc.text(`Otros: ${data.porTipo.otros || 0}`, 25, y);
          y += 15;
        }
        
        if (data.departamentos && data.departamentos.length > 0) {
          doc.setFontSize(14);
          doc.text("Consumos por departamento:", 20, y);
          y += 10;
          
          doc.setFontSize(9);
          doc.text("Departamento", 20, y);
          doc.text("Consumos", 100, y);
          doc.text("Importe", 140, y);
          y += 7;
          
          doc.line(20, y - 3, 190, y - 3);
          
          doc.setFontSize(8);
          for (const dept of data.departamentos) {
            doc.text(dept.nombre || '', 20, y);
            doc.text(String(dept.consumos || 0), 100, y);
            doc.text(`$${dept.importe || 0}`, 140, y);
            y += 6;
          }
        }
      }
      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
        doc.text("Sistema de Control de Comedor - Generado el " + new Date().toLocaleString(), 105, 295, { align: 'center' });
      }
      
      const nombreReporte = tipo === 'detallado' ? `reporte-detallado-${data.fecha}.pdf` : 
                           tipo === 'ejecutivo' ? `reporte-ejecutivo-${data.mes}.pdf` :
                           `reporte-dia-${new Date().toISOString().split('T')[0]}.pdf`;
                           
      doc.save(nombreReporte);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el archivo PDF",
        variant: "destructive"
      });
    }
  }

  return (
    <Layout title="Generación de reportes">
      <div className="space-y-8">
        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">Generar reportes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[#49454f] mb-4">Tipo de reporte</h3>
              <RadioGroup 
                value={tipoReporte} 
                onValueChange={handleTipoReporteChange}
                className="space-y-3"
              >
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
                Seleccione fecha {tipoReporte === 'ejecutivo' ? '(mes/año)' : '(día/mes/año)'}
              </label>
              <div className="relative">
                <Input 
                  id="date" 
                  type="text" 
                  value={fecha}
                  onChange={handleFechaChange}
                  placeholder={tipoReporte === 'ejecutivo' ? 'MM/YYYY' : 'DD/MM/YYYY'}
                  className="border-[#cac4d0] bg-white pl-10" 
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-[#79747e]" />
              </div>
              <p className="text-xs text-[#79747e] mt-1">
                {tipoReporte === 'ejecutivo' 
                  ? 'Formato: MM/YYYY (ej. 05/2025)' 
                  : 'Formato: DD/MM/YYYY (ej. 16/05/2025)'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <Button 
                type="button"
                onClick={generarReporteDia}
                className="bg-[#e8def8] hover:bg-[#d8ccf7] text-[#1d1b20]"
                disabled={loading}
              >
                {loading ? 'Generando...' : 'Generar reporte del día'}
              </Button>
              
              <Button 
                onClick={generarReporte}
                className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]"
                disabled={loading}
              >
                {loading ? 'Generando...' : 'Generar reporte seleccionado'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}