import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { fetchConsumosEmpleados } from '@/lib/backFunctions';

// Colores para las diferentes secciones del gráfico
const COLORS = ['#dca8e4', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

// En lugar de usar interface, usamos comentarios para documentar la estructura
// Los datos procesados tienen esta estructura:
// {
//   departamento: string,
//   cantidad: number,
//   total: number
// }

const GraficoConsumosPorDepartamento = () => {
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tipoGrafico, setTipoGrafico] = useState('bar'); // 'bar' o 'pie'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar y procesar datos directamente desde la API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Obtener datos directamente de la API
        const datosConsumos = await fetchConsumosEmpleados();
        
        // Procesar los datos para el gráfico
        procesarDatosParaGrafico(datosConsumos);
      } catch (err) {
        console.error("Error al cargar datos para el gráfico:", err);
        setError("No se pudieron cargar los datos. Intente nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
    
    // Configurar intervalo para actualización cada 60 segundos (opcional)
    const intervalo = setInterval(() => {
      cargarDatos();
    }, 60000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);

  // Función para procesar los datos recibidos de la API
  const procesarDatosParaGrafico = (datosAPI) => {
    // Si no hay datos, no hacemos nada
    if (!datosAPI || datosAPI.length === 0) {
      setDatosProcesados([]);
      return;
    }

    // Agrupar consumos por departamento
    const consumosPorDepartamento = {};
    
    for (const consumo of datosAPI) {
      const { Departamento, Precio } = consumo;
      
      // Saltamos si no tiene departamento
      if (!Departamento) continue;
      
      if (!consumosPorDepartamento[Departamento]) {
        consumosPorDepartamento[Departamento] = {
          departamento: Departamento,
          cantidad: 0,
          total: 0
        };
      }
      
      consumosPorDepartamento[Departamento].cantidad += 1;
      consumosPorDepartamento[Departamento].total += parseFloat(Precio || '0');
    }
    
    // Convertir a array para los gráficos y ordenar por cantidad
    const datosArray = Object.values(consumosPorDepartamento)
      .map(dept => ({
        ...dept,
        total: parseFloat(dept.total.toFixed(2))  // Redondear a 2 decimales
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
    
    setDatosProcesados(datosArray);
  };

  // Renderizado de sector activo para el PieChart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm">
          {payload.departamento}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999" className="text-xs">
          {`${value} consumos (${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Manejador de cambio de índice activo en el PieChart
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Función para actualizar manualmente los datos
  const actualizarDatos = () => {
    setLoading(true);
    fetchConsumosEmpleados()
      .then(data => {
        procesarDatosParaGrafico(data);
        setError(null);
      })
      .catch(err => {
        console.error("Error al actualizar datos:", err);
        setError("Error al actualizar. Intente nuevamente.");
      })
      .finally(() => setLoading(false));
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-[#79747e]">
        <svg className="animate-spin h-6 w-6 mr-2 text-[#dca8e4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando datos del gráfico...
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="flex flex-col h-48 items-center justify-center text-[#79747e]">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={actualizarDatos}
          className="px-4 py-2 bg-[#dca8e4] text-white rounded-md hover:bg-[#c794d1]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (datosProcesados.length === 0) {
    return (
      <div className="flex flex-col h-48 items-center justify-center text-[#79747e]">
        <p className="mb-4">No hay datos suficientes para mostrar el gráfico</p>
        <button 
          onClick={actualizarDatos}
          className="px-4 py-2 bg-[#dca8e4] text-white rounded-md hover:bg-[#c794d1]"
        >
          Actualizar datos
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Encabezado con selector de tipo de gráfico y botón de actualización */}
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={actualizarDatos}
          className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Actualizar
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTipoGrafico('bar')}
            className={`px-3 py-1 rounded text-sm ${tipoGrafico === 'bar' ? 'bg-[#dca8e4] text-[#1d1b20]' : 'bg-gray-200 text-gray-700'}`}
          >
            Barras
          </button>
          <button
            onClick={() => setTipoGrafico('pie')}
            className={`px-3 py-1 rounded text-sm ${tipoGrafico === 'pie' ? 'bg-[#dca8e4] text-[#1d1b20]' : 'bg-gray-200 text-gray-700'}`}
          >
            Circular
          </button>
        </div>
      </div>

      {/* Gráfico de Barras */}
      {tipoGrafico === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosProcesados}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="departamento" tick={{ fill: '#49454f' }} />
            <YAxis tick={{ fill: '#49454f' }} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'cantidad' ? `${value} consumos` : `$${value}`, 
                name === 'cantidad' ? 'Cantidad' : 'Total'
              ]}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #cac4d0',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '15px'
              }}
            />
            <Bar dataKey="cantidad" name="Cantidad de Consumos" fill="#dca8e4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" name="Total ($)" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Gráfico Circular */}
      {tipoGrafico === 'pie' && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={datosProcesados}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="cantidad"
              onMouseEnter={onPieEnter}
            >
              {datosProcesados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} consumos`]}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #cac4d0',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoConsumosPorDepartamento;