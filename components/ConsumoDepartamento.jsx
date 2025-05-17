import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { fetchConsumosEmpleados, fetchConsumosPorDia } from '@/lib/backFunctions';

const COLORS = ['#dca8e4', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const GraficoConsumosPorDepartamento = () => {
  const [datosConsumoPorDia, setDatosConsumoPorDia] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('bar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
    
    const intervalo = setInterval(() => {
      cargarDatos();
    }, 60000);
    
    return () => clearInterval(intervalo);
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const datosConsumosDia = await fetchConsumosPorDia();
      procesarDatosPorDia(datosConsumosDia);
      setError(null);
    } catch (err) {
      console.error("Error al cargar datos para el gráfico:", err);
      setError("No se pudieron cargar los datos. Intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const procesarDatosPorDia = (datosAPI) => {
    if (!datosAPI || datosAPI.length === 0) {
      setDatosConsumoPorDia([]);
      setDepartamentos([]);
      return;
    }

    console.log("Datos originales de API consumos/dia:", datosAPI);

    const departamentosUnicos = new Set();
    
    const consumosPorDia = {};
    
    datosAPI.forEach(item => {
      const fecha = new Date(item.fecha || item.Fecha);
      const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
      const fechaFormatted = fecha.toISOString().split('T')[0]; // para ordenar
      
      const departamento = item.departamento || item.Departamento;
      
      if (!departamento) {
        console.warn("Encontrado item sin departamento:", item);
        return; // Skip this item
      }
      
      departamentosUnicos.add(departamento);
      
      if (!consumosPorDia[fechaFormatted]) {
        consumosPorDia[fechaFormatted] = {
          fecha: fechaStr,
          fechaSort: fechaFormatted,
          totalDia: 0,
        };
      }
      
      let cantidad = 0;
      if (typeof item.cantidad !== 'undefined') cantidad = Number(item.cantidad);
      else if (typeof item.Cantidad !== 'undefined') cantidad = Number(item.Cantidad);
      else if (typeof item.count !== 'undefined') cantidad = Number(item.count);
      else if (typeof item.Count !== 'undefined') cantidad = Number(item.Count);
      else if (typeof item.total !== 'undefined') cantidad = Number(item.total);
      else if (typeof item.Total !== 'undefined') cantidad = Number(item.Total);
      else cantidad = 1; 
      
      if (!consumosPorDia[fechaFormatted][departamento]) {
        consumosPorDia[fechaFormatted][departamento] = 0;
      }
      consumosPorDia[fechaFormatted][departamento] += cantidad;
      consumosPorDia[fechaFormatted].totalDia += cantidad;
    });
    
    const datosFormateados = Object.values(consumosPorDia);
    datosFormateados.sort((a, b) => a.fechaSort.localeCompare(b.fechaSort));
    
    console.log("Datos procesados para gráfico:", datosFormateados);
    console.log("Departamentos detectados:", Array.from(departamentosUnicos));
    
    const departamentosArray = Array.from(departamentosUnicos);
    
    setDepartamentos(departamentosArray);
    setDatosConsumoPorDia(datosFormateados);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      
      return (
        <div className="bg-white p-3 border border-[#cac4d0] rounded-lg shadow-sm">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-xs text-gray-500 mb-2">Total: {total} consumos</p>
          {payload.map((entry, index) => (
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-xs">{entry.name}: </span>
                </div>
                <span className="text-xs font-medium ml-2">{entry.value}</span>
              </div>
            )
          ))}
        </div>
      );
    }
    return null;
  };

  const actualizarDatos = () => {
    cargarDatos();
  };

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

  if (datosConsumoPorDia.length === 0) {
    return (
      <div className="flex flex-col h-48 items-center justify-center text-[#79747e]">
        <p className="mb-4">No hay datos suficientes</p>
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
            onClick={() => setTipoGrafico('stacked')}
            className={`px-3 py-1 rounded text-sm ${tipoGrafico === 'stacked' ? 'bg-[#dca8e4] text-[#1d1b20]' : 'bg-gray-200 text-gray-700'}`}
          >
            Apiladas
          </button>
        </div>
      </div>

      {/* Gráfico de Barras (mostradas lado a lado) */}
      {tipoGrafico === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosConsumoPorDia}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fill: '#49454f' }} />
            <YAxis tick={{ fill: '#49454f' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {departamentos.map((departamento, index) => (
              <Bar 
                key={departamento} 
                dataKey={departamento} 
                name={departamento} 
                fill={COLORS[index % COLORS.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Gráfico de Barras Apiladas */}
      {tipoGrafico === 'stacked' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosConsumoPorDia}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            stackOffset="expand"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fill: '#49454f' }} />
            <YAxis 
              tick={{ fill: '#49454f' }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {departamentos.map((departamento, index) => (
              <Bar 
                key={departamento} 
                dataKey={departamento} 
                name={departamento} 
                stackId="a"
                fill={COLORS[index % COLORS.length]} 
                radius={[index === 0 ? 4 : 0, index === departamentos.length - 1 ? 4 : 0, index === departamentos.length - 1 ? 4 : 0, index === 0 ? 4 : 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoConsumosPorDepartamento;