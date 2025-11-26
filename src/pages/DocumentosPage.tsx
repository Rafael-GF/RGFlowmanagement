import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileText, Download, Eye, Trash2, Search,
  Filter, File, Image as ImageIcon, FileSpreadsheet, X, Share2, Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useApp, Documento } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export default function DocumentosPage() {
  const { documentos, addDocumento, deleteDocumento, atendimentos } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (tipo: string) => {
    if (tipo.includes('image')) return ImageIcon;
    if (tipo.includes('pdf')) return FileText;
    if (tipo.includes('sheet') || tipo.includes('excel')) return FileSpreadsheet;
    return File;
  };

  const getFileTypeLabel = (tipo: string) => {
    if (tipo.includes('image')) return 'Imagem';
    if (tipo.includes('pdf')) return 'PDF';
    if (tipo.includes('sheet') || tipo.includes('excel')) return 'Planilha';
    if (tipo.includes('document') || tipo.includes('word')) return 'Documento';
    return 'Arquivo';
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const novoDoc: Documento = {
        id: Date.now().toString() + Math.random(),
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        data: new Date().toISOString(),
        atendimentoId: atendimentos[0]?.id || '1',
      };
      addDocumento(novoDoc);
    });

    toast.success(`${files.length} arquivo(s) enviado(s) com sucesso!`);
    setUploadModalOpen(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      deleteDocumento(id);
      toast.success('Documento excluído com sucesso');
      setSelectedDoc(null);
    }
  };

  const handleDownload = (doc: Documento) => {
    toast.success(`Download iniciado: ${doc.nome}`);
  };

  const handleView = (doc: Documento) => {
    setSelectedDoc(doc);
  };

  const handleShare = (doc: Documento) => {
    toast.success('Link de compartilhamento copiado!', {
      description: 'O link foi copiado para a área de transferência',
    });
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filtroTipo === 'Todos' || getFileTypeLabel(doc.tipo) === filtroTipo;
    return matchesSearch && matchesTipo;
  });

  // Agrupar por tipo
  const docsPorTipo = documentosFiltrados.reduce((acc, doc) => {
    const tipo = getFileTypeLabel(doc.tipo);
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(doc);
    return acc;
  }, {} as Record<string, Documento[]>);

  // Estatísticas
  const totalSize = documentos.reduce((acc, doc) => acc + doc.tamanho, 0);
  const tiposUnicos = [...new Set(documentos.map(d => getFileTypeLabel(d.tipo)))];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-white">Gestão de Documentos</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {documentosFiltrados.length} documento(s) • {formatFileSize(totalSize)} total
            </p>
          </div>
          <Button
            variant="success"
            icon={<Upload className="w-5 h-5" />}
            onClick={() => setUploadModalOpen(true)}
          >
            Enviar Documento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Total de Arquivos</p>
                  <p className="text-[#1F3A93] dark:text-blue-400">{documentos.length}</p>
                </div>
                <FileText className="w-8 h-8 text-[#1F3A93]" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Espaço Utilizado</p>
                  <p className="text-[#28A745]">{formatFileSize(totalSize)}</p>
                </div>
                <Upload className="w-8 h-8 text-[#28A745]" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Tipos de Arquivo</p>
                  <p className="text-[#17A2B8]">{tiposUnicos.length}</p>
                </div>
                <File className="w-8 h-8 text-[#17A2B8]" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Este Mês</p>
                  <p className="text-[#FFC107]">
                    {documentos.filter(d => new Date(d.data).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-[#FFC107]" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="Todos">Todos os Tipos</option>
                <option value="PDF">PDF</option>
                <option value="Imagem">Imagem</option>
                <option value="Planilha">Planilha</option>
                <option value="Documento">Documento</option>
              </select>
              <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
                Mais Filtros
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Lista de Documentos Agrupados */}
        <div className="space-y-6">
          {Object.entries(docsPorTipo).map(([tipo, docs]) => (
            <Card key={tipo}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white">{tipo}</h3>
                  <Badge variant="default">{docs.length} arquivo(s)</Badge>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {docs.map((doc, index) => {
                    const Icon = getFileIcon(doc.tipo);
                    const atendimento = atendimentos.find(a => a.id === doc.atendimentoId);
                    
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{doc.nome}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>{formatFileSize(doc.tamanho)}</span>
                              <span>•</span>
                              <span>{new Date(doc.data).toLocaleDateString('pt-BR')}</span>
                              {atendimento && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{atendimento.nome}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Eye className="w-4 h-4" />}
                              onClick={() => handleView(doc)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Download className="w-4 h-4" />}
                              onClick={() => handleDownload(doc)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Share2 className="w-4 h-4" />}
                              onClick={() => handleShare(doc)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 className="w-4 h-4 text-red-500" />}
                              onClick={() => handleDelete(doc.id, doc.nome)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Modal Upload */}
        <AnimatePresence>
          {uploadModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white">Enviar Documentos</h3>
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      dragActive
                        ? 'border-[#1F3A93] bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-[#1F3A93] dark:hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload-modal"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                    />
                    <label htmlFor="file-upload-modal" className="cursor-pointer">
                      <motion.div
                        animate={{ y: dragActive ? -10 : 0 }}
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-full flex items-center justify-center"
                      >
                        <Upload className="w-10 h-10 text-white" />
                      </motion.div>
                      <p className="text-gray-900 dark:text-white mb-2">
                        Clique para selecionar ou arraste arquivos aqui
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (máx. 10MB por arquivo)
                      </p>
                    </label>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-blue-900 dark:text-blue-300 mb-1">
                          Dicas para upload de documentos:
                        </p>
                        <ul className="text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                          <li>Use nomes descritivos para seus arquivos</li>
                          <li>Mantenha os arquivos organizados por tipo</li>
                          <li>Verifique se os documentos estão legíveis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Visualização */}
        <AnimatePresence>
          {selectedDoc && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white">Detalhes do Documento</h3>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Preview Area */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {selectedDoc.tipo.includes('image') ? (
                      <ImageIcon className="w-20 h-20 text-gray-400" />
                    ) : (
                      <FileText className="w-20 h-20 text-gray-400" />
                    )}
                    <span className="ml-4 text-gray-500">Visualização não disponível</span>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Nome do Arquivo</p>
                      <p className="text-gray-900 dark:text-white">{selectedDoc.nome}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Tipo</p>
                      <Badge variant="info">{getFileTypeLabel(selectedDoc.tipo)}</Badge>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Tamanho</p>
                      <p className="text-gray-900 dark:text-white">{formatFileSize(selectedDoc.tamanho)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Data de Upload</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedDoc.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    icon={<Download className="w-5 h-5" />}
                    onClick={() => handleDownload(selectedDoc)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    icon={<Share2 className="w-5 h-5" />}
                    onClick={() => handleShare(selectedDoc)}
                  >
                    Compartilhar
                  </Button>
                  <Button
                    variant="danger"
                    icon={<Trash2 className="w-5 h-5" />}
                    onClick={() => handleDelete(selectedDoc.id, selectedDoc.nome)}
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
