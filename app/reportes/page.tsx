"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { fetchReporteDetallado, fetchReporteEjecutivo } from "@/lib/backFunctions"
import Layout from "@/components/layout"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "lucide-react"
import { jsPDF } from "jspdf"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState<"detallado" | "ejecutivo">("detallado")
  const [fecha, setFecha] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // La fecha inicial ya está establecida como new Date() en el estado
  }, [])

  const handleFechaChange = (date: Date | null) => {
    if (date) {
      setFecha(date)
    }
  }

  const handleTipoReporteChange = (value: string) => {
    setTipoReporte(value as "detallado" | "ejecutivo")
  }

  const generarReporte = async () => {
    setLoading(true)

    try {
      let fechaAPI = ""

      if (tipoReporte === "detallado") {
        const dia = fecha.getDate().toString().padStart(2, "0")
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
        const anio = fecha.getFullYear()
        fechaAPI = `${anio}-${mes}-${dia}`

        try {
          const reporte = await fetchReporteDetallado(fechaAPI)
          generarPDF(reporte, "detallado")

          toast({
            title: "Reporte generado",
            description: `Reporte detallado para ${dia}/${mes}/${anio} generado exitosamente`,
          })
        } catch (error) {
          console.error("Error obteniendo datos del reporte detallado:", error)
          toast({
            title: "Error",
            description: "No se pudieron obtener los datos para el reporte detallado",
            variant: "destructive",
          })
        }
      } else {
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
        const anio = fecha.getFullYear()
        fechaAPI = `${anio}-${mes}`

        try {
          console.log("Solicitando reporte ejecutivo para fecha:", fechaAPI)
          const reporte = await fetchReporteEjecutivo(fechaAPI)
          console.log("Reporte ejecutivo recibido:", reporte)
          generarPDF(reporte, "ejecutivo")

          toast({
            title: "Reporte generado",
            description: `Reporte ejecutivo para ${mes}/${anio} generado exitosamente`,
          })
        } catch (error) {
          console.error("Error obteniendo datos del reporte ejecutivo:", error)
          toast({
            title: "Error",
            description: "No se pudieron obtener los datos para el reporte ejecutivo",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo generar el reporte solicitado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generarPDF = (data: any, tipo: string) => {
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      console.error("⚠️ Datos vacíos. No se generará el PDF.")
      console.error("Datos recibidos:", data)
      toast({
        title: "Error",
        description: "No se pudo generar el PDF porque los datos están vacíos.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log(`Generando PDF para reporte tipo ${tipo} con datos:`, data)
      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text(
        `Reporte ${tipo === "detallado" ? "Detallado" : tipo === "ejecutivo" ? "Ejecutivo" : "del Día"}`,
        105,
        15,
        { align: "center" },
      )

      doc.setFontSize(12)
      const fechaTexto =
        tipo === "detallado"
          ? `Fecha: ${data.fecha}`
          : tipo === "ejecutivo"
            ? `Mes: ${data.mes}`
            : `Fecha: ${data.fecha || new Date().toLocaleDateString()}`
      doc.text(fechaTexto, 105, 25, { align: "center" })

      doc.line(20, 30, 190, 30)

      let y = 40

      if (tipo === "detallado" || tipo === "dia") {
        doc.setFontSize(14)
        doc.text("Totales:", 20, y)
        y += 10

        doc.setFontSize(10)
        if (data.totales) {
          doc.text(`Desayunos: ${data.totales.desayunos || 0}`, 25, y)
          y += 7
          doc.text(`Comidas: ${data.totales.comidas || 0}`, 25, y)
          y += 7
          doc.text(`Total consumos: ${data.totales.total || 0}`, 25, y)
          y += 7
          doc.text(`Importe total: $${data.totales.importe?.toFixed(2) || 0}`, 25, y)
          y += 15
        }

        if (data.consumos && data.consumos.length > 0 && tipo === "detallado") {
          doc.setFontSize(14)
          doc.text("Consumos:", 20, y)
          y += 10

          doc.setFontSize(9)
          doc.text("Empleado", 20, y)
          doc.text("Departamento", 60, y)
          doc.text("Comida", 100, y)
          doc.text("Tipo", 140, y)
          doc.text("Precio", 170, y)
          y += 7

          doc.line(20, y - 3, 190, y - 3)

          const consumosMostrados = data.consumos.slice(0, 20)

          doc.setFontSize(8)
          for (const consumo of consumosMostrados) {
            doc.text(consumo.empleado?.substring(0, 18) || "", 20, y)
            doc.text(consumo.departamento?.substring(0, 18) || "", 60, y)
            doc.text(consumo.comida?.substring(0, 18) || "", 100, y)
            doc.text(consumo.tipo || "", 140, y)
            doc.text(`$${consumo.precio || 0}`, 170, y)
            y += 6

            if (y > 280) {
              doc.addPage()
              y = 20
            }
          }

          if (data.consumos.length > 20) {
            doc.setFontSize(9)
            doc.text(`... y ${data.consumos.length - 20} consumos más`, 105, y + 10, { align: "center" })
          }
        }

        if (data.departamentos && data.departamentos.length > 0) {
          doc.setFontSize(14)
          doc.text("Consumos por departamento:", 20, y)
          y += 10

          doc.setFontSize(9)
          doc.text("Departamento", 20, y)
          doc.text("Consumos", 100, y)
          doc.text("Importe", 140, y)
          y += 7

          doc.line(20, y - 3, 190, y - 3)

          doc.setFontSize(8)
          for (const dept of data.departamentos) {
            doc.text(dept.nombre || "", 20, y)
            doc.text(String(dept.consumos || 0), 100, y)
            doc.text(`$${typeof dept.importe === "number" ? dept.importe.toFixed(2) : dept.importe || 0}`, 140, y)
            y += 6
          }
        }
      } else if (tipo === "ejecutivo") {
        doc.setFontSize(14)
        doc.text("Resumen mensual:", 20, y)
        y += 10

        doc.setFontSize(10)
        if (data.totales) {
          doc.text(`Total consumos: ${data.totales.consumos || 0}`, 25, y)
          y += 7
          doc.text(
            `Importe total: $${typeof data.totales.importe === "number" ? data.totales.importe.toFixed(2) : data.totales.importe || 0}`,
            25,
            y,
          )
          y += 15
        }

        if (data.porTipo) {
          doc.setFontSize(14)
          doc.text("Desglose por tipo:", 20, y)
          y += 10

          doc.setFontSize(10)
          doc.text(`Desayunos: ${data.porTipo.desayunos || 0}`, 25, y)
          y += 7
          doc.text(`Comidas: ${data.porTipo.comidas || 0}`, 25, y)
          y += 15
        }

        if (data.departamentos && data.departamentos.length > 0) {
          doc.setFontSize(14)
          doc.text("Consumos por departamento:", 20, y)
          y += 10

          doc.setFontSize(9)
          doc.text("Departamento", 20, y)
          doc.text("Consumos", 100, y)
          doc.text("Importe", 140, y)
          y += 7

          doc.line(20, y - 3, 190, y - 3)

          doc.setFontSize(8)
          for (const dept of data.departamentos) {
            doc.text(dept.nombre || "", 20, y)
            doc.text(String(dept.consumos || 0), 100, y)
            doc.text(`$${typeof dept.importe === "number" ? dept.importe.toFixed(2) : dept.importe || 0}`, 140, y)
            y += 6
          }
        }
      }

      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" })
        doc.text("Sistema de Control de Comedor - Generado el " + new Date().toLocaleString(), 105, 295, {
          align: "center",
        })
      }

      const nombreReporte =
        tipo === "detallado"
          ? `reporte-detallado-${data.fecha}.pdf`
          : tipo === "ejecutivo"
            ? `reporte-ejecutivo-${data.mes}.pdf`
            : `reporte-dia-${new Date().toISOString().split("T")[0]}.pdf`

      doc.save(nombreReporte)

      toast({
        title: "Reporte generado exitosamente",
        description: `El reporte ha sido guardado como ${nombreReporte}`,
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el archivo PDF",
        variant: "destructive",
      })
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
              <RadioGroup value={tipoReporte} onValueChange={handleTipoReporteChange} className="space-y-3">
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
                Seleccione fecha {tipoReporte === "ejecutivo" ? "(mes/año)" : "(día/mes/año)"}
              </label>
              <div className="relative">
                <div className="relative">
                  <div className="flex items-center border border-[#cac4d0] rounded-md bg-white pl-3">
                    <Calendar className="h-5 w-5 text-[#79747e] mr-2" />
                    <DatePicker
                      selected={fecha}
                      onChange={handleFechaChange}
                      className="w-full py-2 px-1 focus:outline-none"
                      dateFormat={tipoReporte === "ejecutivo" ? "MM/yyyy" : "dd/MM/yyyy"}
                      showMonthYearPicker={tipoReporte === "ejecutivo"}
                      showFullMonthYearPicker={tipoReporte === "ejecutivo"}
                      showPopperArrow={false}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#79747e] mt-1">
                {tipoReporte === "ejecutivo"
                  ? "Formato: MM/YYYY (ej. 05/2025)"
                  : "Formato: DD/MM/YYYY (ej. 16/05/2025)"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <Button
                onClick={generarReporte}
                className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]"
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar reporte seleccionado"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
