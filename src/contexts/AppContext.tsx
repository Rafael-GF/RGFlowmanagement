import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Page = 'login' | 'dashboard' | 'pre-atendimento' | 'tarefas' | 'documentos' | 'relatorios';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface Atendimento {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  observacoes: string;
  status: 'Novo' | 'Em Andamento' | 'Aguardando' | 'Concluído' | 'Cancelado';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  data: string;
  dataAtualizacao: string;
  responsavel?: string;
  documentos?: string[];
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Atrasada';
  statusColor: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  categoria: string;
  atendimentoId?: string;
  progresso: number;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  data: string;
  atendimentoId: string;
  url?: string;
}

export interface Notificacao {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
}

interface AppContextType {
  usuario: Usuario | null;
  currentPage: Page;
  atendimentos: Atendimento[];
  tarefas: Tarefa[];
  documentos: Documento[];
  notificacoes: Notificacao[];
  darkMode: boolean;
  setUsuario: (usuario: Usuario | null) => void;
  setCurrentPage: (page: Page) => void;
  addAtendimento: (atendimento: Atendimento) => void;
  updateAtendimento: (id: string, atendimento: Partial<Atendimento>) => void;
  deleteAtendimento: (id: string) => void;
  addTarefa: (tarefa: Tarefa) => void;
  updateTarefa: (id: string, tarefa: Partial<Tarefa>) => void;
  deleteTarefa: (id: string) => void;
  addDocumento: (documento: Documento) => void;
  deleteDocumento: (id: string) => void;
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'lida' | 'data'>) => void;
  marcarNotificacaoLida: (id: string) => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [darkMode, setDarkMode] = useState(false);
  
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([
    {
      id: '1',
      nome: 'Carlos Mendes',
      email: 'carlos@email.com',
      telefone: '(11) 98765-4321',
      tipo: 'Administrativo',
      observacoes: 'Cliente precisa de documentação urgente',
      status: 'Em Andamento',
      prioridade: 'Alta',
      data: '2025-11-15',
      dataAtualizacao: '2025-11-20',
      responsavel: 'Maria Santos',
    },
    {
      id: '2',
      nome: 'Ana Paula Silva',
      email: 'ana.silva@email.com',
      telefone: '(21) 97654-3210',
      tipo: 'Financeiro',
      observacoes: 'Solicitação de revisão de contrato',
      status: 'Novo',
      prioridade: 'Média',
      data: '2025-11-20',
      dataAtualizacao: '2025-11-20',
    },
    {
      id: '3',
      nome: 'Roberto Oliveira',
      email: 'roberto@email.com',
      telefone: '(31) 96543-2109',
      tipo: 'Outro',
      observacoes: 'Consulta sobre procedimentos',
      status: 'Aguardando',
      prioridade: 'Baixa',
      data: '2025-11-18',
      dataAtualizacao: '2025-11-19',
      responsavel: 'João Ferreira',
    },
  ]);

  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: '1',
      titulo: 'Coletar documentação cliente',
      descricao: 'Reunir todos os documentos necessários para o processo',
      responsavel: 'Maria Santos',
      prazo: '2025-11-22',
      status: 'Em andamento',
      statusColor: '#17A2B8',
      prioridade: 'Alta',
      categoria: 'Documentação',
      progresso: 60,
    },
    {
      id: '2',
      titulo: 'Organizar planilha financeira',
      descricao: 'Atualizar planilha com dados do último trimestre',
      responsavel: 'João Ferreira',
      prazo: '2025-11-23',
      status: 'Em andamento',
      statusColor: '#17A2B8',
      prioridade: 'Média',
      categoria: 'Financeiro',
      progresso: 40,
    },
    {
      id: '3',
      titulo: 'Enviar relatório mensal',
      descricao: 'Compilar e enviar relatório de atividades',
      responsavel: 'Ana Costa',
      prazo: '2025-11-25',
      status: 'Concluída',
      statusColor: '#28A745',
      prioridade: 'Alta',
      categoria: 'Relatórios',
      progresso: 100,
    },
    {
      id: '4',
      titulo: 'Revisar contratos pendentes',
      descricao: 'Análise jurídica de contratos em aberto',
      responsavel: 'Pedro Lima',
      prazo: '2025-11-21',
      status: 'Atrasada',
      statusColor: '#DC3545',
      prioridade: 'Urgente',
      categoria: 'Jurídico',
      progresso: 25,
    },
  ]);

  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: '1',
      nome: 'contrato_servicos.pdf',
      tipo: 'application/pdf',
      tamanho: 2458000,
      data: '2025-11-15',
      atendimentoId: '1',
    },
    {
      id: '2',
      nome: 'identidade_cliente.jpg',
      tipo: 'image/jpeg',
      tamanho: 1234000,
      data: '2025-11-15',
      atendimentoId: '1',
    },
    {
      id: '3',
      nome: 'comprovante_residencia.pdf',
      tipo: 'application/pdf',
      tamanho: 890000,
      data: '2025-11-16',
      atendimentoId: '2',
    },
  ]);

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      tipo: 'warning',
      titulo: 'Tarefa Atrasada',
      mensagem: 'A tarefa "Revisar contratos pendentes" está atrasada',
      lida: false,
      data: new Date().toISOString(),
    },
    {
      id: '2',
      tipo: 'success',
      titulo: 'Atendimento Concluído',
      mensagem: 'O atendimento #1234 foi finalizado com sucesso',
      lida: false,
      data: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const addAtendimento = (atendimento: Atendimento) => {
    setAtendimentos([atendimento, ...atendimentos]);
    addNotificacao({
      tipo: 'success',
      titulo: 'Atendimento Criado',
      mensagem: `Atendimento para ${atendimento.nome} foi criado com sucesso`,
    });
  };

  const updateAtendimento = (id: string, updates: Partial<Atendimento>) => {
    setAtendimentos(atendimentos.map(a => 
      a.id === id ? { ...a, ...updates, dataAtualizacao: new Date().toISOString() } : a
    ));
  };

  const deleteAtendimento = (id: string) => {
    setAtendimentos(atendimentos.filter(a => a.id !== id));
  };

  const addTarefa = (tarefa: Tarefa) => {
    setTarefas([tarefa, ...tarefas]);
    addNotificacao({
      tipo: 'success',
      titulo: 'Tarefa Criada',
      mensagem: `Tarefa "${tarefa.titulo}" foi criada com sucesso`,
    });
  };

  const updateTarefa = (id: string, updates: Partial<Tarefa>) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTarefa = (id: string) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  const addDocumento = (documento: Documento) => {
    setDocumentos([documento, ...documentos]);
  };

  const deleteDocumento = (id: string) => {
    setDocumentos(documentos.filter(d => d.id !== id));
  };

  const addNotificacao = (notificacao: Omit<Notificacao, 'id' | 'lida' | 'data'>) => {
    const nova: Notificacao = {
      ...notificacao,
      id: Date.now().toString(),
      lida: false,
      data: new Date().toISOString(),
    };
    setNotificacoes([nova, ...notificacoes]);
  };

  const marcarNotificacaoLida = (id: string) => {
    setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={{
        usuario,
        currentPage,
        atendimentos,
        tarefas,
        documentos,
        notificacoes,
        darkMode,
        setUsuario,
        setCurrentPage,
        addAtendimento,
        updateAtendimento,
        deleteAtendimento,
        addTarefa,
        updateTarefa,
        deleteTarefa,
        addDocumento,
        deleteDocumento,
        addNotificacao,
        marcarNotificacaoLida,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
