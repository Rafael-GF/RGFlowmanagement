// Tipos centralizados da aplicação RGFlow Management

export type Page = 'login' | 'dashboard' | 'pre-atendimento' | 'tarefas' | 'documentos' | 'relatorios';

export type StatusAtendimento = 'Novo' | 'Em Andamento' | 'Aguardando' | 'Concluído' | 'Cancelado';

export type StatusTarefa = 'Pendente' | 'Em andamento' | 'Concluída' | 'Atrasada';

export type Prioridade = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export type UserRole = 'admin' | 'user' | 'manager';

export type TipoAtendimento = 'Administrativo' | 'Financeiro' | 'Jurídico' | 'Técnico' | 'Comercial' | 'Outro';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  role: UserRole;
  departamento?: string;
  telefone?: string;
  dataCadastro?: string;
}

export interface Atendimento {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: TipoAtendimento;
  observacoes: string;
  status: StatusAtendimento;
  prioridade: Prioridade;
  data: string;
  dataAtualizacao: string;
  responsavel?: string;
  documentos?: string[];
  protocolo?: string;
  tags?: string[];
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  status: StatusTarefa;
  statusColor: string;
  prioridade: Prioridade;
  categoria: string;
  atendimentoId?: string;
  progresso: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
  tempoEstimado?: number;
  tags?: string[];
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  data: string;
  atendimentoId: string;
  url?: string;
  uploadedBy?: string;
  versao?: number;
  tags?: string[];
}

export interface Notificacao {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
  link?: string;
  userId?: string;
}

export interface Atividade {
  id: string;
  tipo: 'atendimento' | 'tarefa' | 'documento' | 'sistema';
  descricao: string;
  usuario: string;
  tempo: string;
  data: string;
  metadata?: Record<string, any>;
}

export interface Filtro {
  campo: string;
  operador: 'igual' | 'diferente' | 'contem' | 'maior' | 'menor';
  valor: any;
}

export interface Paginacao {
  pagina: number;
  porPagina: number;
  total: number;
}

export interface Estatistica {
  label: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  color?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
};
