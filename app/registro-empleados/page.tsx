"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"
import { registrarEmpleado, fetchEmpleados, eliminarEmpleado, actualizarEmpleado } from "@/lib/backFunctions" 
import { Empleado } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast" 

export default function RegistroEmpleados() {
  const [nombre, setNombre] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [imagen, setImagen] = useState("") 

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  
  const [editMode, setEditMode] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mostrandoTodos, setMostrandoTodos] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.current?.click();
};

  const { toast } = useToast()

  useEffect(() => {
    cargarEmpleados()
  }, [])

  //MUESTRA EMPLEADOS
  const cargarEmpleados = async () => {
    setLoading(true)
    try {
      const data = await fetchEmpleados()
      // Ordenamos los empleados por ID de forma descendente (asumiendo que los IDs más altos son los más recientes)
      const empleadosOrdenados = [...data].sort((a, b) => 
        Number(b.Id_Empleado) - Number(a.Id_Empleado)
      )
      setEmpleados(empleadosOrdenados)
    } catch (error) {
      console.error("Error al cargar empleados:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los empleados",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre || !departamento) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      let response;
      if (editMode && empleadoEditando) {
        response = await actualizarEmpleado(empleadoEditando, nombre, departamento, imagen);
        toast({
          title: "Éxito",
          description: "Empleado actualizado correctamente",
        });
        setEditMode(false);
        setEmpleadoEditando(null);
      } else {
        response = await registrarEmpleado(nombre, departamento, imagen);
        toast({
          title: "Éxito",
          description: "Empleado registrado correctamente",
        });
      }
      
      resetForm()
      
      cargarEmpleados()
      setMostrandoTodos(false)
    } catch (error: any) {
      console.error("Error en operación:", error)
      
      let errorMessage = editMode 
        ? "No se pudo actualizar el empleado" 
        : "No se pudo registrar el empleado";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.originalError?.message === "Network Error") {
        errorMessage = "Error de conexión. Verifica tu Internet y que la API esté accesible.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  //ELIMINA UN EMPLEADO
  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await eliminarEmpleado(id)
        toast({
          title: "Éxito",
          description: "Empleado eliminado correctamente"
        })
        cargarEmpleados() 
      } catch (error) {
        console.error("Error al eliminar empleado:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el empleado",
          variant: "destructive"
        })
      }
    }
  }

  const resetForm = () => {
    setNombre("")
    setDepartamento("")
    setImagen("default.jpg")
  }
  
  //EDITAR UN EMPLEADO
  const handleEditar = (empleado: Empleado) => {
    setNombre(empleado.Nombre);
    setDepartamento(empleado.Departamento);
    setImagen(empleado.Imagen || "default.jpg");
    setEditMode(true);
    setEmpleadoEditando(empleado.Id_Empleado.toString());
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  const cancelarEdicion = () => {
    resetForm();
    setEditMode(false);
    setEmpleadoEditando(null);
  }

  const [tipoImagen, setTipoImagen] = useState("image/jpeg");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagen(base64String); // preview inmediato
      };
      reader.readAsDataURL(file);
    }
  };

  // Obtener los empleados a mostrar (todos o solo los más recientes)
  const empleadosAMostrar = mostrandoTodos 
    ? empleados 
    : empleados.slice(0, 5); // Solo tomamos los primeros 5 (que ya están ordenados por más recientes)

  return (
    <Layout title="Registro de empleados">
      <div className="space-y-8">
        <Card className="rounded-xl border-[#cac4d0] p-8">
          <h2 className="text-xl font-medium text-[#1d1b20] mb-6">
            {editMode ? "Editar empleado" : "Registro de nuevo empleado"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-[#49454f] mb-2">
                Nombre completo
              </label>
              <Input 
                id="fullName" 
                className="border-[#cac4d0] bg-white" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-[#49454f] mb-2">
                Departamento
              </label>
              <Select value={departamento} onValueChange={setDepartamento}>
                <SelectTrigger className="border-[#cac4d0] bg-white">
                  <SelectValue placeholder="Selecciona departamento..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finanzas">Finanzas</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Ventas">Ventas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
  <label htmlFor="photo" className="block text-[#49454f] mb-2">
    Fotografía
  </label>

  <div className="border border-[#cac4d0] rounded-md p-4 bg-white flex items-center gap-4">
    {/* Imagen preview */}
    <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden">
      <img
        src={
          imagen && imagen !== "default.jpg"
            ? imagen
            : "/userPlaceholder.png"
        }
        alt="Foto del empleado"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Botón para subir/cambiar foto */}
    <div>
      <Button
        type="button"
        variant="outline"
        className="text-[#49454f] cursor-pointer"
        onClick={triggerFileInput}
      >
        {imagen && imagen !== "default.jpg" ? "Cambiar Foto" : "Subir Foto"}
      </Button>

      <input
        type="file"
        id="photo"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
        accept="image/*"
      />

      <p className="text-xs text-[#79747e] mt-2">
        Formato permitido: .jpg, .png. Tamaño máximo recomendado: 1.5 MB
      </p>
    </div>
  </div>
</div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="text-[#49454f]"
                onClick={editMode ? cancelarEdicion : resetForm}
              >
                {editMode ? "Cancelar" : "Limpiar"}
              </Button>
              <Button 
                type="submit" 
                className="bg-[#dca8e4] hover:bg-[#c794d1] text-[#1d1b20]"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (editMode ? "Actualizando..." : "Registrando...") 
                  : (editMode ? "Actualizar empleado" : "Registrar empleado")
                }
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-xl border-[#cac4d0] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-[#1d1b20]">
              {mostrandoTodos ? "Todos los empleados" : "Empleados recientes"}
            </h2>
            
            {empleados.length > 5 && (
              <Button 
                type="button"
                variant="outline"
                className="text-sm text-[#49454f]"
                onClick={() => setMostrandoTodos(!mostrandoTodos)}
              >
                {mostrandoTodos ? "Mostrar recientes" : "Ver todos"}
              </Button>
            )}
          </div>

          {loading ? (
            <p className="text-center py-4">Cargando empleados...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f3edf7] text-left">
                  <th className="px-4 py-3 text-[#49454f] font-medium rounded-l-md">Foto</th>
                    <th className="px-4 py-3 text-[#49454f] font-medium rounded-l-md">Nombre</th>
                    <th className="px-4 py-3 text-[#49454f] font-medium">No. Empleado</th>
                    <th className="px-4 py-3 text-[#49454f] font-medium">Departamento</th>
                    <th className="px-4 py-3 text-[#49454f] font-medium rounded-r-md">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleadosAMostrar.length > 0 ? (
                    empleadosAMostrar.map((empleado, index) => (
                      <tr key={empleado.Id_Empleado || index} className={index < empleadosAMostrar.length - 1 ? "border-b border-[#cac4d0]" : ""}>
                        <td className="px-4 py-3">
                          <img 
                            src={empleado.Imagen} 
                            alt={`Foto de ${empleado.Nombre}`} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.src = "./userPlaceholder.png";
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-[#1d1b20]">{empleado.Nombre}</td>
                        <td className="px-4 py-3 text-[#1d1b20]">{empleado.Id_Empleado}</td>
                        <td className="px-4 py-3 text-[#1d1b20]">{empleado.Departamento}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <button 
                              onClick={() => handleEditar(empleado)}
                              className="block text-blue-500 hover:underline"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleEliminar(empleado.Id_Empleado.toString())}
                              className="block text-red-500 hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-[#79747e]">
                        No hay empleados registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}