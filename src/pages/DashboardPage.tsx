import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, CheckSquare, Send, TrendingUp, TrendingDown,
  Clock, AlertCircle, Plus, Filter, Calendar, Users, Activity
} from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';

export default function DashboardPage() {
  const { atendimentos, tarefas, setCurrentPage } = useApp();
  const [periodo, setPeriodo] = useState('30dias');

  // Cálculos de métricas
  const atendimentosNovos = atendimentos.filter(a => a.status === 'Novo').length;
  const atendimentosEmAndamento = atendimentos.filter(a => a.status === 'Em Andamento').length;
  const tarefasPendentes = tarefas.filter(t => t.status === 'Pendente' || t.status === 'Atrasada').length;
  const tarefasAtrasadas = tarefas.filter(t => t.status === 'Atrasada').length;
  const atendimentosEncaminhados = atendimentos.filter(a => a.responsavel).length;
  
  // Taxa de conclusão
  const taxaConclusao = tarefas.length > 0 
    ? Math.round((tarefas.filter(t => t.status === 'Concluída').length / tarefas.length) * 100)
    : 0;

  // Dados para gráficos
  const tarefasData = [
    { name: 'Seg', pendentes: 4, concluidas: 6, atrasadas: 1 },
    { name: 'Ter', pendentes: 3, concluidas: 8, atrasadas: 2 },
    { name: 'Qua', pendentes: 5, concluidas: 7, atrasadas: 1 },
    { name: 'Qui', pendentes: 2, concluidas: 9, atrasadas: 0 },
    { name: 'Sex', pendentes: 6, concluidas: 5, atrasadas: 3 },
    { name: 'Sáb', pendentes: 1, concluidas: 3, atrasadas: 0 },
    { name: 'Dom', pendentes: 2, concluidas: 2, atrasadas: 0 },
  ];

  const atendimentosData = [
    { mes: 'Jun', atendimentos: 28, resolvidos: 25 },
    { mes: 'Jul', atendimentos: 35, resolvidos: 32 },
    { mes: 'Ago', atendimentos: 42, resolvidos: 38 },
    { mes: 'Set', atendimentos: 38, resolvidos: 36 },
    { mes: 'Out', atendimentos: 45, resolvidos: 41 },
    { mes: 'Nov', atendimentos: 52, resolvidos: 48 },
  ];

  const statusDistribuicao = [
    { name: 'Concluídas', value: tarefas.filter(t => t.status === 'Concluída').length, color: '#28A745' },
    { name: 'Em Andamento', value: tarefas.filter(t => t.status === 'Em andamento').length, color: '#17A2B8' },
    { name: 'Pendentes', value: tarefas.filter(t => t.status === 'Pendente').length, color: '#FFC107' },
    { name: 'Atrasadas', value: tarefasAtrasadas, color: '#DC3545' },
  ];

  const atividadesRecentes = [
    { id: 1, tipo: 'atendimento', descricao: 'Novo atendimento criado', usuario: 'Carlos Mendes', tempo: '5 min atrás' },
    { id: 2, tipo: 'tarefa', descricao: 'Tarefa concluída: Enviar relatório', usuario: 'Ana Costa', tempo: '15 min atrás' },
    { id: 3, tipo: 'documento', descricao: 'Documento enviado', usuario: 'João Ferreira', tempo: '1 hora atrás' },
    { id: 4, tipo: 'atendimento', descricao: 'Atendimento finalizado', usuario: 'Maria Santos', tempo: '2 horas atrás' },
  ];

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    trend?: 'up' | 'down'; 
    trendValue?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
    };

    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="relative overflow-hidden"
      >
        <Card className="h-full">
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <h2 className="text-gray-900 dark:text-white mb-2">{value}</h2>
                {trend && trendValue && (
                  <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{trendValue}</span>
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visão geral do sistema - Atualizado em tempo real
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
            </select>
            <Button
              variant="success"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setCurrentPage('pre-atendimento')}
            >
              Novo Atendimento
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Atendimentos Novos"
            value={atendimentosNovos}
            icon={FileText}
            trend="up"
            trendValue="+12% esta semana"
            color="blue"
          />
          <StatCard
            title="Tarefas Pendentes"
            value={tarefasPendentes}
            icon={CheckSquare}
            trend="down"
            trendValue="-8% esta semana"
            color="yellow"
          />
          <StatCard
            title="Em Andamento"
            value={atendimentosEmAndamento}
            icon={Activity}
            color="purple"
          />
          <StatCard
            title="Encaminhados"
            value={atendimentosEncaminhados}
            icon={Send}
            trend="up"
            trendValue="+5% esta semana"
            color="green"
          />
          <StatCard
            title="Tarefas Atrasadas"
            value={tarefasAtrasadas}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Taxa de Conclusão */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 dark:text-white">Taxa de Conclusão</h3>
                <p className="text-gray-600 dark:text-gray-400">Performance geral do time</p>
              </div>
              <div className="text-right">
                <p className="text-[#28A745]">{taxaConclusao}%</p>
                <p className="text-sm text-gray-500">das tarefas concluídas</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${taxaConclusao}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#28A745] to-[#34d058] rounded-full"
              />
            </div>
          </CardBody>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarefas por Status - Pie Chart */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Distribuição de Tarefas</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusDistribuicao}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {statusDistribuicao.map((item) => (
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

          {/* Tarefas Semanais - Bar Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Tarefas - Últimos 7 dias</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tarefasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
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
        </div>

        {/* Atendimentos Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-gray-900 dark:text-white">Volume de Atendimentos - Tendência</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={atendimentosData}>
                <defs>
                  <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F3A93" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1F3A93" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolvidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#28A745" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#28A745" stopOpacity={0}/>
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
                  name="Total de Atendimentos"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="resolvidos" 
                  stroke="#28A745" 
                  fillOpacity={1} 
                  fill="url(#colorResolvidos)"
                  name="Resolvidos"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Atividades Recentes e Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Atividades Recentes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white">Atividades Recentes</h3>
                <Button variant="ghost" size="sm">Ver todas</Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {atividadesRecentes.map((atividade, index) => (
                  <motion.div
                    key={atividade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        atividade.tipo === 'atendimento' ? 'bg-blue-500' :
                        atividade.tipo === 'tarefa' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">{atividade.descricao}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {atividade.usuario} • {atividade.tempo}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 dark:text-white">Ações Rápidas</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentPage('pre-atendimento')}
                icon={<FileText className="w-5 h-5" />}
              >
                Novo Atendimento
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentPage('tarefas')}
                icon={<CheckSquare className="w-5 h-5" />}
              >
                Nova Tarefa
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentPage('documentos')}
                icon={<FileText className="w-5 h-5" />}
              >
                Enviar Documento
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentPage('relatorios')}
                icon={<BarChart className="w-5 h-5" />}
              >
                Gerar Relatório
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
