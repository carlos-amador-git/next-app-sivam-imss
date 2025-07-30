'use client';


import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Activity,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Hospital,
  Search,
  Filter,
  ChevronDown,
  User,
  CheckCircle,
  AlertCircle,
  ClockFill, // Assuming you have this icon or a similar one
  Hourglass, // Assuming you have this icon
  Target // Assuming you have this icon
} from 'lucide-react'; // Using Lucide for all icons for consistency

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button, // Using your custom Button component, but also keeping HeroUI's for Modal actions
  useDisclosure,
} from "@heroui/react"; // Assuming @heroui/react provides these components
import CalendarBooking from '@/components/CalendarBooking';

// Datos simulados basados en los CSV analizados
const hospitalData = {
  cirugias: [
    { id: '000003412407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'AGUSTINA JACQUELINE SIMOTA ARGUELLO', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Tumor benigno lipomatoso', rezago: 235, delegacion: 'CHIAPAS' },
    { id: '000002012407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'TERESA DE JESUS MORALES ZUNUN', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Tumor benigno lipomatoso', rezago: 241, delegacion: 'CHIAPAS' },
    { id: '000001712407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'DULCE OLIVIA SALGADO BETANZOS', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Hernia umbilical', rezago: 241, delegacion: 'CHIAPAS' },
    { id: '000007112507HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'KAROL YOLEY HERRERA DIAZ', especialidad: 'OBSTETRICIA', diagnostico: 'Supervisión de embarazo', rezago: 54, delegacion: 'CHIAPAS' },
    { id: '000010712507HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'FLOR SELENY MORALES AGUILAR', especialidad: 'OBSTETRICIA', diagnostico: 'Presentación de nalgas', rezago: 38, delegacion: 'CHIAPAS' },
    { id: '000010812507HF19', hospital: 'HGZ 50 San Luis Potosí', paciente: 'CARLOS ENRIQUE RUIZ', especialidad: 'GINECOLOGÍA', diagnostico: 'Miomatosis uterina', rezago: 120, delegacion: 'SAN LUIS POTOSÍ' },
    { id: '000010912507HF19', hospital: 'HGZ 1 Aguascalientes', paciente: 'ANA SOFIA LÓPEZ MARTÍNEZ', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Apendicitis aguda', rezago: 90, delegacion: 'AGUASCALIENTES' },
    { id: '000011012507HF19', hospital: 'HGSZ 30 Ciudad de México', paciente: 'MARIO ALBERTO VAZQUEZ', especialidad: 'MEDICINA INTERNA', diagnostico: 'Colecistitis crónica', rezago: 180, delegacion: 'CIUDAD DE MÉXICO' },
    { id: '000011112507HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'LAURA IVONNE RAMÍREZ', especialidad: 'PEDIATRÍA', diagnostico: 'Amigdalectomía', rezago: 65, delegacion: 'CHIAPAS' },
    { id: '000011212507HF19', hospital: 'HGMZ 2a Guadalajara', paciente: 'JORGE LUIS SÁNCHEZ', especialidad: 'UROLOGÍA', diagnostico: 'Litiasis renal', rezago: 280, delegacion: 'JALISCO' },
  ],
  espera: [
    { clave: '000534912301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'CELINA AGUIRRE GARCIA', procedimiento: 'Ureteroscopia', diasEspera: 527, delegacion: 'AGUASCALIENTES' },
    { clave: '000534612301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'MARIA GUADALUPE ALONSO ROCHA', procedimiento: 'Colecistectomía laparoscópica', diasEspera: 527, delegacion: 'AGUASCALIENTES' },
    { clave: '000533812301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'ARMANDO MARTINEZ LIMON', procedimiento: 'Reparación hernia inguinal', diasEspera: 527, delegacion: 'AGUASCALIENTES' },
    { clave: '000533912301HD01', hospital: 'HGSZ 30 Ciudad de México', paciente: 'ROBERTO RAMÍREZ ESTRADA', procedimiento: 'Cirugía de catarata', diasEspera: 280, delegacion: 'CIUDAD DE MÉXICO' },
    { clave: '000534012301HD01', hospital: 'HGZ 50 San Luis Potosí', paciente: 'SOFIA VEGA LÓPEZ', procedimiento: 'Histerectomía', diasEspera: 350, delegacion: 'SAN LUIS POTOSÍ' },
    { clave: '000534112301HD01', hospital: 'HGSMF 19 Huixtla', paciente: 'JUAN PABLO GUTIÉRREZ', procedimiento: 'Colecistectomía laparoscópica', diasEspera: 150, delegacion: 'CHIAPAS' },
    { clave: '000534212301HD01', hospital: 'HGMZ 2a Guadalajara', paciente: 'ELENA PÉREZ DÍAZ', procedimiento: 'Reemplazo de rodilla', diasEspera: 480, delegacion: 'JALISCO' },
  ]
};

const especialidadesData = [
  { name: 'CIRUGÍA GENERAL', value: 45, color: '#3b82f6' }, // blue-500
  { name: 'GINECOLOGÍA', value: 20, color: '#8b5cf6' },    // purple-500
  { name: 'OBSTETRICIA', value: 15, color: '#f59e0b' },    // amber-500
  { name: 'MEDICINA INTERNA', value: 10, color: '#ef4444' }, // red-500
  { name: 'PEDIATRÍA', value: 5, color: '#10b981' },       // emerald-500
  { name: 'UROLOGÍA', value: 5, color: '#06b6d4' },        // cyan-500
];

const tendenciaRezago = [
  { mes: 'Ene', promedio: 145, meta: 90 },
  { mes: 'Feb', promedio: 165, meta: 90 },
  { mes: 'Mar', promedio: 178, meta: 90 },
  { mes: 'Abr', promedio: 198, meta: 90 },
  { mes: 'May', promedio: 187, meta: 90 },
  { mes: 'Jun', promedio: 156, meta: 90 }
];

const HospitalDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedDelegacion, setSelectedDelegacion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPatientForScheduling, setSelectedPatientForScheduling] = useState(null); // New state for modal data

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Dynamically get unique delegations from both datasets
  const allDelegations = useMemo(() => {
    const cirugiaDelegations = hospitalData.cirugias.map(c => c.delegacion);
    const esperaDelegations = hospitalData.espera.map(e => e.delegacion);
    return ['all', ...new Set([...cirugiaDelegations, ...esperaDelegations])].sort();
  }, []);

  const stats = useMemo(() => {
    const totalCirugias = hospitalData.cirugias.length;
    const totalEspera = hospitalData.espera.length;

    // Handle division by zero for averages
    const promedioRezago = totalCirugias > 0
      ? hospitalData.cirugias.reduce((acc, c) => acc + c.rezago, 0) / totalCirugias
      : 0;
    const promedioEspera = totalEspera > 0
      ? hospitalData.espera.reduce((acc, e) => acc + e.diasEspera, 0) / totalEspera
      : 0;

    // Calculate critical cases for alerts
    const criticalCases = hospitalData.espera.filter(p => p.diasEspera >= 500).length;
    const attentionRequiredCases = hospitalData.espera.filter(p => p.diasEspera >= 300 && p.diasEspera < 500).length;

    return {
      totalCirugias,
      totalEspera,
      promedioRezago: Math.round(promedioRezago),
      promedioEspera: Math.round(promedioEspera),
      criticalCases,
      attentionRequiredCases
    };
  }, []);

  const filteredCirugias = useMemo(() => {
    let filtered = hospitalData.cirugias;
    if (selectedDelegacion !== 'all') {
      filtered = filtered.filter(item => item.delegacion === selectedDelegacion);
    }
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [selectedDelegacion, searchTerm]);

  const filteredEspera = useMemo(() => {
    let filtered = hospitalData.espera;
    if (selectedDelegacion !== 'all') {
      filtered = filtered.filter(item => item.delegacion === selectedDelegacion);
    }
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.procedimiento?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [selectedDelegacion, searchTerm]);

  // Simulate capacity for the progress bar
  const totalWaitingCapacity = 50; // Example total capacity
  const waitingListPercentage = (filteredEspera.length / totalWaitingCapacity) * 100;


  const StatCard = ({ title, value, icon: Icon, trend, trendType = "neutral", bgColor = "bg-blue-500" }) => {
    const trendColorClass = trendType === "positive" ? "text-green-600" : trendType === "negative" ? "text-red-600" : "text-gray-600";
    const TrendIcon = trendType === "positive" ? TrendingUp : trendType === "negative" ? TrendingUp : null; // Use TrendingUp or TrendingDown as appropriate

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColorClass} mr-1 ${trendType === "negative" ? 'rotate-180' : ''}`} />}
                <span className={`text-sm font-medium ${trendColorClass}`}>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColor} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </div>
    );
  };

  const Chip = ({ children, color = "blue", size = "sm" }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800",
      cyan: "bg-cyan-100 text-cyan-800"
    };

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1 text-sm"
    };

    return (
      <span className={`inline-flex items-center font-medium rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}>
        {children}
      </span>
    );
  };

  const Avatar = ({ name, size = "sm" }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base"
    };

    const getInitials = (name) => {
      if (!name) return '';
      const parts = name.split(' ');
      if (parts.length > 1) {
        return parts[0].charAt(0) + parts[1].charAt(0);
      }
      return parts[0].charAt(0);
    }

    return (
      <div className={`${sizeClasses[size]} bg-blue-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}>
        {getInitials(name)}
      </div>
    );
  };

  const Progress = ({ value, max = 100, color = "blue", label }) => (
    <div className="w-full">
      {label && <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  const Tab = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
      {children}
    </button>
  );

  const renderTable = (data, columns) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                No hay datos disponibles para mostrar.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Hospitalario
              </h1>
              <p className="text-gray-600">
                Monitoreo y gestión de cirugías y lista de espera.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Dropdown Delegación */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-48 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>{selectedDelegacion === 'all' ? 'Todas las Delegaciones' : selectedDelegacion}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {allDelegations.map((delegacion, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedDelegacion(delegacion); setIsDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {delegacion === 'all' ? 'Todas las Delegaciones' : delegacion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar paciente o hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cirugías"
            value={stats.totalCirugias}
            icon={Activity}
            trend="+12% vs mes anterior"
            trendType="positive"
            bgColor="bg-blue-500"
          />
          <StatCard
            title="En Lista de Espera"
            value={stats.totalEspera}
            icon={Clock}
            trend="-8% vs mes anterior"
            trendType="positive"
            bgColor="bg-orange-500"
          />
          <StatCard
            title="Promedio Rezago"
            value={`${stats.promedioRezago} días`}
            icon={AlertTriangle}
            trend="+5% vs mes anterior"
            trendType="negative"
            bgColor="bg-red-500"
          />
          <StatCard
            title="Promedio Espera"
            value={`${stats.promedioEspera} días`}
            icon={Calendar}
            trend="-15% vs mes anterior"
            trendType="positive"
            bgColor="bg-green-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Tab
              isActive={selectedTab === 'overview'}
              onClick={() => setSelectedTab('overview')}
            >
              Resumen General
            </Tab>
            <Tab
              isActive={selectedTab === 'surgeries'}
              onClick={() => setSelectedTab('surgeries')}
            >
              Cirugías Realizadas
            </Tab>
            <Tab
              isActive={selectedTab === 'waiting'}
              onClick={() => setSelectedTab('waiting')}
            >
              Lista de Espera
            </Tab>
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Distribución por Especialidad */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribución por Especialidad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={especialidadesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {especialidadesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {especialidadesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tendencia de Rezago */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Tendencia de Rezago vs Meta (Días)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tendenciaRezago} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="promedio"
                      stroke="#ef4444" // Red for average rezago
                      fill="#ef4444"
                      fillOpacity={0.15}
                      name="Promedio Real"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      stroke="#10b981" // Green for meta
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alertas y Notificaciones */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Alertas y Notificaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 mb-1">Casos Críticos</p>
                  <p className="text-sm text-red-700">
                    Hay **{stats.criticalCases} casos** con más de 500 días en lista de espera. ¡Requieren atención inmediata!
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start">
                <Clock className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">Atención Requerida</p>
                  <p className="text-sm text-yellow-700">
                    **{stats.attentionRequiredCases} casos** se acercan al límite (300-499 días de espera). Considere su programación.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 mb-1">Buen Desempeño</p>
                  <p className="text-sm text-green-700">
                    El promedio de espera ha disminuido un 15% este mes, lo que indica una mejora operativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'surgeries' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Registro de Cirugías Realizadas</h3>
            {renderTable(filteredCirugias, [
              {
                header: 'PACIENTE',
                key: 'paciente',
                render: (row) => (
                  <div className="flex items-center">
                    <Avatar name={row.paciente} />
                    <span className="ml-2 font-medium">{row.paciente}</span>
                  </div>
                )
              },
              { header: 'HOSPITAL', key: 'hospital' },
              {
                header: 'ESPECIALIDAD',
                key: 'especialidad',
                render: (row) => (
                  <Chip color={
                    row.especialidad === 'CIRUGÍA GENERAL' ? 'blue' :
                      row.especialidad === 'GINECOLOGÍA' ? 'purple' :
                        row.especialidad === 'OBSTETRICIA' ? 'yellow' :
                          row.especialidad === 'MEDICINA INTERNA' ? 'red' : 'green'
                  }>
                    {row.especialidad}
                  </Chip>
                )
              },
              { header: 'DIAGNÓSTICO', key: 'diagnostico' },
              {
                header: 'REZAGO',
                key: 'rezago',
                render: (row) => (
                  <Chip color={row.rezago > 200 ? 'red' : row.rezago > 100 ? 'yellow' : 'green'}>
                    {row.rezago} días
                  </Chip>
                )
              },
              {
                header: 'ESTADO',
                render: () => <Chip color="green"><CheckCircle className="w-3 h-3 mr-1" /> Completada</Chip>
              }
            ])}
          </div>
        )}

        {selectedTab === 'waiting' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pacientes en Lista de Espera</h3>
              <div className="w-64">
                <Progress value={waitingListPercentage} color={waitingListPercentage > 80 ? 'red' : waitingListPercentage > 50 ? 'yellow' : 'green'} label="Capacidad utilizada" />
              </div>
            </div>
            {renderTable(filteredEspera, [
              {
                header: 'PACIENTE',
                key: 'paciente',
                render: (row) => (
                  <div className="flex items-center">
                    <Avatar name={row.paciente} />
                    <span className="ml-2 font-medium">{row.paciente}</span>
                  </div>
                )
              },
              { header: 'HOSPITAL', key: 'hospital' },
              { header: 'PROCEDIMIENTO', key: 'procedimiento' },
              {
                header: 'DÍAS EN ESPERA',
                key: 'diasEspera',
                render: (row) => (
                  <Chip color={row.diasEspera >= 500 ? 'red' : row.diasEspera >= 300 ? 'yellow' : 'blue'}>
                    {row.diasEspera} días
                  </Chip>
                )
              },
              {
                header: 'PRIORIDAD',
                render: (row) => (
                  <Chip color={row.diasEspera >= 500 ? 'red' : row.diasEspera >= 300 ? 'yellow' : 'green'}>
                    {row.diasEspera >= 500 ? 'Crítica' : row.diasEspera >= 300 ? 'Alta' : 'Media'}
                  </Chip>
                )
              },
              {
                header: 'ACCIONES',
                render: (row) => (
                  <Button
                    color="primary"
                    onPress={() => {
                      // console.log('Scheduling for:', row);
                      setSelectedPatientForScheduling(row);
                      onOpen();
                    }}
                  >
                    Programar
                  </Button>
                )
              }
            ])}
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='5xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-900">
                {/* {console.log('Selected Patient for Scheduling:', selectedPatientForScheduling)} */}
                {selectedPatientForScheduling ? `Programar Cita para ${selectedPatientForScheduling.paciente}` : 'Programar Cita'}
              </ModalHeader>
              <ModalBody>
                {selectedPatientForScheduling ? (
                  <div className="space-y-4 text-gray-700">
                    {/* <p>
                      <span className="font-semibold">Paciente:</span> {selectedPatientForScheduling.paciente}
                    </p>
                    <p>
                      <span className="font-semibold">Hospital:</span> {selectedPatientForScheduling.hospital}
                    </p>
                    <p>
                      <span className="font-semibold">Procedimiento:</span> {selectedPatientForScheduling.procedimiento}
                    </p>
                    <p>
                      <span className="font-semibold">Días en Espera:</span> {selectedPatientForScheduling.diasEspera}
                    </p> */}
                    {/* <div className="mt-4">
                      <p className="font-semibold text-gray-800">Detalles de Programación:</p>
                      
                      <div className="mt-2 space-y-3">
                        <div>
                          <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Fecha de Cita Sugerida:</label>
                          <input
                            type="date"
                            id="scheduleDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label htmlFor="scheduleNotes" className="block text-sm font-medium text-gray-700">Notas:</label>
                          <textarea
                            id="scheduleNotes"
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          ></textarea>
                        </div>
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <p className="text-gray-600">Seleccione un paciente para programar la cita.</p>
                )}
                <CalendarBooking res={selectedPatientForScheduling}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                {/* <Button color="primary" onPress={onClose} disabled={!selectedPatientForScheduling}>
                  Confirmar Programación
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HospitalDashboard;
