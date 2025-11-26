import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  FileDown, Filter, Calendar, TrendingUp, TrendingDown,
  Users, Clock, CheckCircle, AlertCircle, Download, Share2
} from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export default function RelatoriosPage() {
  const { atendimentos, tarefas, documentos } = useApp();
  const [periodo, setPeriodo] = useState('30dias');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  // Métricas gerais
  const totalAtendimentos = atendimentos.length;
  const atendimentosConcluidos = atendimentos.filter(a => a.status === 'Concluído').length;
  const tarefasPendentes = tarefas.filter(t => t.status === 'Pendente' || t.status === 'Atrasada').length;
  const tarefasConcluidas = tarefas.filter(t => t.status === 'Concluída').length;
  const taxaConclusaoAtendimentos = totalAtendimentos > 0 
    ? Math.round((atendimentosConcluidos / totalAtendimentos) * 100)
    : 0;
  const taxaConclusaoTarefas = tarefas.length > 0
    ? Math.round((tarefasConcluidas / tarefas.length) * 100)
    : 0;

  // Tempo médio (simulado)
  const tempoMedio = '2.5 dias';

  // Dados para gráficos
  const tarefasDistribuicao = [
    { name: 'Concluídas', value: tarefasConcluidas, color: '#28A745' },
    { name: 'Em Andamento', value: tarefas.filter(t => t.status === 'Em andamento').length, color: '#17A2B8' },
    { name: 'Pendentes', value: tarefas.filter(t => t.status === 'Pendente').length, color: '#FFC107' },
    { name: 'Atrasadas', value: tarefas.filter(t => t.status === 'Atrasada').length, color: '#DC3545' },
  ];

  const atendimentosStatus = [
    { name: 'Novos', value: atendimentos.filter(a => a.status === 'Novo').length, color: '#1F3A93' },
    { name: 'Em Andamento', value: atendimentos.filter(a => a.status === 'Em Andamento').length, color: '#17A2B8' },
    { name: 'Aguardando', value: atendimentos.filter(a => a.status === 'Aguardando').length, color: '#FFC107' },
    { name: 'Concluídos', value: atendimentosConcluidos, color: '#28A745' },
  ];

  const volumeMensal = [
    { mes: 'Jun', atendimentos: 28, tarefas: 42, documentos: 15 },
    { mes: 'Jul', atendimentos: 35, tarefas: 48, documentos: 22 },
    { mes: 'Ago', atendimentos: 42, tarefas: 55, documentos: 28 },
    { mes: 'Set', atendimentos: 38, tarefas: 51, documentos: 25 },
    { mes: 'Out', atendimentos: 45, tarefas: 58, documentos: 31 },
    { mes: 'Nov', atendimentos: 52, tarefas: 64, documentos: 38 },
  ];

  const performancePorResponsavel = [
    { nome: 'Maria Santos', concluidas: 15, pendentes: 3, atrasadas: 1 },
    { nome: 'João Ferreira', concluidas: 12, pendentes: 5, atrasadas: 2 },
    { nome: 'Ana Costa', concluidas: 18, pendentes: 2, atrasadas: 0 },
    { nome: 'Pedro Lima', concluidas: 10, pendentes: 6, atrasadas: 3 },
  ];

  const performanceRadar = [
    { categoria: 'Atendimentos', valor: 85 },
    { categoria: 'Tarefas', valor: 78 },
    { categoria: 'Documentos', valor: 92 },
    { categoria: 'Prazos', valor: 75 },
    { categoria: 'Qualidade', valor: 88 },
  ];

  const prioridadeDistribuicao = [
    { name: 'Urgente', value: atendimentos.filter(a => a.prioridade === 'Urgente').length + tarefas.filter(t => t.prioridade === 'Urgente').length, color: '#DC3545' },
    { name: 'Alta', value: atendimentos.filter(a => a.prioridade === 'Alta').length + tarefas.filter(t => t.prioridade === 'Alta').length, color: '#FFC107' },
    { name: 'Média', value: atendimentos.filter(a => a.prioridade === 'Média').length + tarefas.filter(t => t.prioridade === 'Média').length, color: '#17A2B8' },
    { name: 'Baixa', value: atendimentos.filter(a => a.prioridade === 'Baixa').length + tarefas.filter(t => t.prioridade === 'Baixa').length, color: '#28A745' },
  ];

  const handleExport = (formato: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Gerando relatório em ${formato}...`,
        success: `Relatório exportado com sucesso em ${formato}!`,
        error: 'Erro ao exportar relatório',
      }
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend,
    color = 'blue'
  }: any) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
    };

    return (
      <Card>
        <CardBody>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-400 mb-1">{title}</p>
              <h2 className="text-gray-900 dark:text-white mb-2">{value}</h2>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
              )}
              {trend && (
                <div className={`flex items-center gap-1 text-sm mt-2 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-white">Relatórios e Análises</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Análise completa de performance e métricas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="ano">Último ano</option>
            </select>
            <Button
              variant="outline"
              icon={<Filter className="w-5 h-5" />}
            >
              Filtros
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Atendimentos"
            value={totalAtendimentos}
            subtitle={`${taxaConclusaoAtendimentos}% concluídos`}
            icon={FileDown}
            trend={{ direction: 'up', value: '+12% vs. mês anterior' }}
            color="blue"
          />
          <StatCard
            title="Tarefas Pendentes"
            value={tarefasPendentes}
            subtitle={`${tarefasConcluidas} concluídas`}
            icon={CheckCircle}
            trend={{ direction: 'down', value: '-8% vs. mês anterior' }}
            color="yellow"
          />
          <StatCard
            title="Taxa de Conclusão"
            value={`${taxaConclusaoTarefas}%`}
            subtitle="Tarefas completadas"
            icon={TrendingUp}
            trend={{ direction: 'up', value: '+5% vs. mês anterior' }}
            color="green"
          />
          <StatCard
            title="Tempo Médio"
            value={tempoMedio}
            subtitle="Por atendimento"
            icon={Clock}
            color="red"
          />
        </div>

        {/* Tipo de Relatório */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['geral', 'atendimentos', 'tarefas', 'performance'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoRelatorio(tipo)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    tipoRelatorio === tipo
                      ? 'bg-gradient-to-r from-[#1F3A93] to-[#28A745] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de Tarefas */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Distribuição de Tarefas</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tarefasDistribuicao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tarefasDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {tarefasDistribuicao.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Status de Atendimentos */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Status de Atendimentos</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={atendimentosStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {atendimentosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Volume Mensal */}
        <Card>
          <CardHeader>
            <h3 className="text-gray-900 dark:text-white">Evolução Mensal</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={volumeMensal}>
                <defs>
                  <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F3A93" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1F3A93" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarefas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#28A745" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#28A745" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDocumentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17A2B8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#17A2B8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="atendimentos" 
                  stroke="#1F3A93" 
                  fillOpacity={1} 
                  fill="url(#colorAtendimentos)"
                  name="Atendimentos"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="tarefas" 
                  stroke="#28A745" 
                  fillOpacity={1} 
                  fill="url(#colorTarefas)"
                  name="Tarefas"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="documentos" 
                  stroke="#17A2B8" 
                  fillOpacity={1} 
                  fill="url(#colorDocumentos)"
                  name="Documentos"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Performance e Prioridades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance por Responsável */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Performance por Responsável</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performancePorResponsavel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="nome" stroke="#6b7280" angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="concluidas" fill="#28A745" name="Concluídas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendentes" fill="#FFC107" name="Pendentes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="atrasadas" fill="#DC3545" name="Atrasadas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Análise Radar */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Análise de Performance Geral</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceRadar}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="categoria" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  <Radar 
                    name="Performance" 
                    dataKey="valor" 
                    stroke="#1F3A93" 
                    fill="#1F3A93" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Distribuição de Prioridades */}
        <Card>
          <CardHeader>
            <h3 className="text-gray-900 dark:text-white">Distribuição por Prioridade</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {prioridadeDistribuicao.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{item.value} itens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / Math.max(...prioridadeDistribuicao.map(p => p.value))) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Ações de Exportação */}
        <Card>
          <CardHeader>
            <h3 className="text-gray-900 dark:text-white">Exportar Relatórios</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="success"
                icon={<FileDown className="w-5 h-5" />}
                onClick={() => handleExport('PDF')}
                className="w-full"
              >
                Exportar PDF
              </Button>
              <Button
                variant="success"
                icon={<FileDown className="w-5 h-5" />}
                onClick={() => handleExport('Excel')}
                className="w-full"
              >
                Exportar Excel
              </Button>
              <Button
                variant="outline"
                icon={<Download className="w-5 h-5" />}
                onClick={() => handleExport('CSV')}
                className="w-full"
              >
                Exportar CSV
              </Button>
              <Button
                variant="outline"
                icon={<Share2 className="w-5 h-5" />}
                onClick={() => toast.success('Link de compartilhamento copiado!')}
                className="w-full"
              >
                Compartilhar
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
