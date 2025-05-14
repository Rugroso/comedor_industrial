import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

const COLORS = ['#dca8e4', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const GraficoConsumosPorDepartamento = ({ consumos, empleados }) => {
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tipoGrafico, setTipoGrafico] = useState('bar');

  useEffect(() => {
    if (!consumos || !empleados || consumos.length === 0 || empleados.length === 0) {
      setDatosProcesados([]);
      return;
    }

    const empleadosDepartamentos = {};
    empleados.forEach(emp => {
      empleadosDepartamentos[emp.Id_Empleado] = emp.Departamento;
    });

    const consumosPorDepartamento = {};
    
    for (const consumo of consumos) {
      const departamento = empleadosDepartamentos[consumo.ID_Empleado];
      
      if (!departamento) continue;
      
      if (!consumosPorDepartamento[departamento]) {
        consumosPorDepartamento[departamento] = {
          departamento,
          cantidad: 0,
          total: 0
        };
      }
      
      consumosPorDepartamento[departamento].cantidad += 1;
      consumosPorDepartamento[departamento].total += parseFloat(consumo.Precio || 0);
    }
    
    const datosArray = Object.values(consumosPorDepartamento)
      .map(dept => ({
        ...dept,
        total: parseFloat(dept.total.toFixed(2))  
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
    
    setDatosProcesados(datosArray);
  }, [consumos, empleados]);

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

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (datosProcesados.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-[#79747e]">
        No hay datos suficientes para mostrar el gráfico
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Selector de tipo de gráfico */}
      <div className="mb-4 flex justify-end gap-2">
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

      {/* GRAFICO DE BARRAS */}
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
                name === 'cantidad' ? `${value} consumos` : `${value}`, 
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
            <Bar dataKey="cantidad" name="Cantidad de Consumo" fill="#dca8e4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" name="Total" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* GRAFICO CIRCULAR */}
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