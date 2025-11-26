import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, FileText, Save, CheckCircle, User, Mail, Phone, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useApp, Atendimento } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export default function PreAtendimentoPage() {
  const { addAtendimento, setCurrentPage } = useApp();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'Administrativo',
    prioridade: 'Média',
    observacoes: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const tiposOptions = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Jurídico', label: 'Jurídico' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Outro', label: 'Outro' },
  ];

  const prioridadeOptions = [
    { value: 'Baixa', label: 'Baixa' },
    { value: 'Média', label: 'Média' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Urgente', label: 'Urgente' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Formato: (11) 98765-4321';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      toast.success(`${newFiles.length} arquivo(s) adicionado(s)`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.info('Arquivo removido');
  };

  const handleSubmit = async (createTask: boolean = false) => {
    if (!validate()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    
    // Simular upload de arquivos
    await new Promise(resolve => setTimeout(resolve, 1500));

    const novoAtendimento: Atendimento = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      tipo: formData.tipo,
      observacoes: formData.observacoes,
      status: 'Novo',
      prioridade: formData.prioridade as 'Baixa' | 'Média' | 'Alta' | 'Urgente',
      data: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      documentos: files.map(f => f.name),
    };

    addAtendimento(novoAtendimento);

    toast.success('Atendimento criado com sucesso!', {
      description: `Protocolo: #${novoAtendimento.id}`,
    });

    setLoading(false);

    if (createTask) {
      setCurrentPage('tarefas');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      'Baixa': 'default',
      'Média': 'info',
      'Alta': 'warning',
      'Urgente': 'danger',
    };
    return colors[prioridade as keyof typeof colors] || 'default';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 dark:text-white">Pré-Atendimento</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Cadastre um novo atendimento no sistema
            </p>
          </div>
          <Badge variant="primary" size="lg">
            Novo Atendimento
          </Badge>
        </div>

        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#1F3A93]" />
              <h3 className="text-gray-900 dark:text-white">Informações do Cliente</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: João Silva Santos"
                  icon={<User className="w-5 h-5" />}
                  error={errors.nome}
                  required
                />
              </div>
              
              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="joao.silva@email.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email}
                required
              />
              
              <Input
                label="Telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 98765-4321"
                icon={<Phone className="w-5 h-5" />}
                error={errors.telefone}
                helperText="Formato: (DDD) 00000-0000"
                required
              />
            </div>
          </CardBody>
        </Card>

        {/* Detalhes do Atendimento */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1F3A93]" />
              <h3 className="text-gray-900 dark:text-white">Detalhes do Atendimento</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Tipo de Atendimento"
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  options={tiposOptions}
                  required
                />
                
                <Select
                  label="Prioridade"
                  value={formData.prioridade}
                  onChange={(e) => handleInputChange('prioridade', e.target.value)}
                  options={prioridadeOptions}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Descreva os detalhes do atendimento, informações relevantes, histórico do cliente, etc."
                />
              </div>

              {/* Preview da Prioridade */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Classificação do Atendimento</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                  <Badge variant="info">{formData.tipo}</Badge>
                  <span className="text-gray-600 dark:text-gray-400">Prioridade:</span>
                  <Badge variant={getPrioridadeColor(formData.prioridade) as any}>
                    {formData.prioridade}
                  </Badge>
                </div>
              </motion.div>
            </div>
          </CardBody>
        </Card>

        {/* Upload de Documentos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#1F3A93]" />
              <h3 className="text-gray-900 dark:text-white">Documentos</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Dropzone */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#1F3A93] dark:hover:border-blue-500 transition-colors cursor-pointer group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#1F3A93] dark:group-hover:text-blue-400" />
                  </motion.div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Clique para fazer upload ou arraste arquivos aqui
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Suporta: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (máx. 10MB por arquivo)
                  </p>
                </label>
              </div>

              {/* Lista de Arquivos */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    Arquivos anexados ({files.length})
                  </p>
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-[#1F3A93] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFile(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Ações */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setCurrentPage('dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => handleSubmit(false)}
                loading={loading}
                icon={<Save className="w-5 h-5" />}
              >
                Salvar Atendimento
              </Button>
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={() => handleSubmit(true)}
                loading={loading}
                icon={<CheckCircle className="w-5 h-5" />}
              >
                Salvar e Criar Tarefa
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
