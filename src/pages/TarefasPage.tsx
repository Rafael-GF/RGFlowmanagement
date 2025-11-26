import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Search, Filter, Edit, Trash2, CheckCircle,
  Clock, AlertTriangle, MoreVertical, Eye, User
} from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useApp, Tarefa } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export default function TarefasPage() {
  const { tarefas, addTarefa, updateTarefa, deleteTarefa } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('Todas');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    responsavel: '',
    prazo: '',
    status: 'Pendente',
    prioridade: 'Média',
    categoria: 'Geral',
    progresso: 0,
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      responsavel: '',
      prazo: '',
      status: 'Pendente',
      prioridade: 'Média',
      categoria: 'Geral',
      progresso: 0,
    });
    setEditingTarefa(null);
  };

  const handleOpenModal = (tarefa?: Tarefa) => {
    if (tarefa) {
      setEditingTarefa(tarefa);
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        responsavel: tarefa.responsavel,
        prazo: tarefa.prazo,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        categoria: tarefa.categoria,
        progresso: tarefa.progresso,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const statusColors: Record<string, string> = {
      'Pendente': '#FFC107',
      'Em andamento': '#17A2B8',
      'Concluída': '#28A745',
      'Atrasada': '#DC3545',
    };

    if (editingTarefa) {
      updateTarefa(editingTarefa.id, {
        ...formData,
        statusColor: statusColors[formData.status],
      });
      toast.success('Tarefa atualizada com sucesso!');
    } else {
      const novaTarefa: Tarefa = {
        id: Date.now().toString(),
        ...formData,
        statusColor: statusColors[formData.status],
      };
      addTarefa(novaTarefa);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTarefa(id);
      toast.success('Tarefa excluída com sucesso');
      setSelectedTarefa(null);
    }
  };

  const handleUpdateProgresso = (id: string, progresso: number) => {
    updateTarefa(id, { progresso });
    
    if (progresso === 100) {
      updateTarefa(id, { status: 'Concluída', statusColor: '#28A745' });
      toast.success('Tarefa concluída! 🎉');
    }
  };

  // Filtros
  const tarefasFiltradas = tarefas.filter(tarefa => {
    const matchesSearch = tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarefa.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroStatus === 'Todos' || tarefa.status === filtroStatus;
    const matchesPrioridade = filtroPrioridade === 'Todas' || tarefa.prioridade === filtroPrioridade;
    
    return matchesSearch && matchesStatus && matchesPrioridade;
  });

  // Kanban columns
  const kanbanColumns = {
    'Pendente': tarefasFiltradas.filter(t => t.status === 'Pendente'),
    'Em andamento': tarefasFiltradas.filter(t => t.status === 'Em andamento'),
    'Concluída': tarefasFiltradas.filter(t => t.status === 'Concluída'),
    'Atrasada': tarefasFiltradas.filter(t => t.status === 'Atrasada'),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluída': return <CheckCircle className="w-4 h-4" />;
      case 'Em andamento': return <Clock className="w-4 h-4" />;
      case 'Atrasada': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPrioridadeVariant = (prioridade: string) => {
    const variants = {
      'Baixa': 'default',
      'Média': 'info',
      'Alta': 'warning',
      'Urgente': 'danger',
    };
    return variants[prioridade as keyof typeof variants] || 'default';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-white">Gerenciamento de Tarefas</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {tarefasFiltradas.length} tarefa(s) encontrada(s)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tabela
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Kanban
              </button>
            </div>
            <Button
              variant="success"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => handleOpenModal()}
            >
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
              <Select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                options={[
                  { value: 'Todos', label: 'Todos os Status' },
                  { value: 'Pendente', label: 'Pendente' },
                  { value: 'Em andamento', label: 'Em andamento' },
                  { value: 'Concluída', label: 'Concluída' },
                  { value: 'Atrasada', label: 'Atrasada' },
                ]}
              />
              <Select
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                options={[
                  { value: 'Todas', label: 'Todas as Prioridades' },
                  { value: 'Baixa', label: 'Baixa' },
                  { value: 'Média', label: 'Média' },
                  { value: 'Alta', label: 'Alta' },
                  { value: 'Urgente', label: 'Urgente' },
                ]}
              />
              <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
                Mais Filtros
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Content */}
        {viewMode === 'table' ? (
          /* Tabela */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Tarefa
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Prazo
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tarefasFiltradas.map((tarefa, index) => (
                    <motion.tr
                      key={tarefa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setSelectedTarefa(tarefa)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white">{tarefa.titulo}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {tarefa.categoria}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">
                              {tarefa.responsavel.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-gray-900 dark:text-white">{tarefa.responsavel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{tarefa.prazo}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getPrioridadeVariant(tarefa.prioridade) as any}>
                          {tarefa.prioridade}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className="flex items-center gap-1"
                          style={{ backgroundColor: tarefa.statusColor + '20', color: tarefa.statusColor }}
                        >
                          {getStatusIcon(tarefa.status)}
                          {tarefa.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${tarefa.progresso}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: tarefa.statusColor }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
                            {tarefa.progresso}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTarefa(tarefa);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(tarefa);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="w-4 h-4 text-red-500" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(tarefa.id);
                            }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Kanban */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(kanbanColumns).map(([status, tarefasColuna]) => (
              <div key={status}>
                <div className="mb-4">
                  <h3 className="text-gray-900 dark:text-white mb-1">{status}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tarefasColuna.length} tarefa(s)
                  </p>
                </div>
                <div className="space-y-3">
                  {tarefasColuna.map((tarefa) => (
                    <motion.div
                      key={tarefa.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTarefa(tarefa)}
                    >
                      <Card hover className="cursor-pointer">
                        <CardBody className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-gray-900 dark:text-white flex-1">{tarefa.titulo}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<MoreVertical className="w-4 h-4" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(tarefa);
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {tarefa.descricao}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant={getPrioridadeVariant(tarefa.prioridade) as any} size="sm">
                              {tarefa.prioridade}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tarefa.prazo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">
                                {tarefa.responsavel.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {tarefa.responsavel}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Criar/Editar */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <h3 className="text-gray-900 dark:text-white">
                    {editingTarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <Input
                    label="Título da Tarefa"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Revisar documentação do cliente"
                    required
                  />
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Descreva os detalhes da tarefa..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Responsável"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                      placeholder="Nome do responsável"
                      icon={<User className="w-5 h-5" />}
                      required
                    />
                    
                    <Input
                      label="Prazo"
                      type="date"
                      value={formData.prazo}
                      onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      options={[
                        { value: 'Pendente', label: 'Pendente' },
                        { value: 'Em andamento', label: 'Em andamento' },
                        { value: 'Concluída', label: 'Concluída' },
                        { value: 'Atrasada', label: 'Atrasada' },
                      ]}
                    />
                    
                    <Select
                      label="Prioridade"
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                      options={[
                        { value: 'Baixa', label: 'Baixa' },
                        { value: 'Média', label: 'Média' },
                        { value: 'Alta', label: 'Alta' },
                        { value: 'Urgente', label: 'Urgente' },
                      ]}
                    />
                    
                    <Select
                      label="Categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      options={[
                        { value: 'Geral', label: 'Geral' },
                        { value: 'Documentação', label: 'Documentação' },
                        { value: 'Financeiro', label: 'Financeiro' },
                        { value: 'Jurídico', label: 'Jurídico' },
                        { value: 'Relatórios', label: 'Relatórios' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Progresso: {formData.progresso}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.progresso}
                      onChange={(e) => setFormData({ ...formData, progresso: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={handleSubmit}
                  >
                    {editingTarefa ? 'Salvar Alterações' : 'Criar Tarefa'}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Detalhes da Tarefa */}
        <AnimatePresence>
          {selectedTarefa && !showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white">Detalhes da Tarefa</h3>
                  <button
                    onClick={() => setSelectedTarefa(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-gray-900 dark:text-white mb-2">{selectedTarefa.titulo}</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPrioridadeVariant(selectedTarefa.prioridade) as any}>
                        {selectedTarefa.prioridade}
                      </Badge>
                      <Badge
                        style={{ backgroundColor: selectedTarefa.statusColor + '20', color: selectedTarefa.statusColor }}
                      >
                        {selectedTarefa.status}
                      </Badge>
                      <Badge variant="default">{selectedTarefa.categoria}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Descrição</p>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedTarefa.descricao}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Responsável</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">
                            {selectedTarefa.responsavel.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-white">{selectedTarefa.responsavel}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Prazo</p>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedTarefa.prazo}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 dark:text-gray-400">Progresso</p>
                      <span className="text-gray-900 dark:text-white">{selectedTarefa.progresso}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={selectedTarefa.progresso}
                      onChange={(e) => handleUpdateProgresso(selectedTarefa.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    icon={<Edit className="w-5 h-5" />}
                    onClick={() => {
                      setSelectedTarefa(null);
                      handleOpenModal(selectedTarefa);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    icon={<Trash2 className="w-5 h-5" />}
                    onClick={() => handleDelete(selectedTarefa.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
