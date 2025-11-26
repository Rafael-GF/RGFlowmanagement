// Constantes da aplicação RGFlow Management

export const APP_NAME = 'RGFlow Management';
export const APP_VERSION = '2.0.0 Enterprise';
export const APP_DESCRIPTION = 'Sistema de Gestão Empresarial';

// Cores do Sistema
export const COLORS = {
  primary: '#1F3A93',
  secondary: '#28A745',
  success: '#28A745',
  warning: '#FFC107',
  danger: '#DC3545',
  info: '#17A2B8',
  gray: '#6c757d',
} as const;

// Status Colors
export const STATUS_COLORS = {
  Novo: '#1F3A93',
  'Em Andamento': '#17A2B8',
  Aguardando: '#FFC107',
  Concluído: '#28A745',
  Cancelado: '#6c757d',
  Pendente: '#FFC107',
  'Em andamento': '#17A2B8',
  Concluída: '#28A745',
  Atrasada: '#DC3545',
} as const;

// Prioridade Colors
export const PRIORIDADE_COLORS = {
  Baixa: '#28A745',
  Média: '#17A2B8',
  Alta: '#FFC107',
  Urgente: '#DC3545',
} as const;

// Tipos de Atendimento
export const TIPOS_ATENDIMENTO = [
  'Administrativo',
  'Financeiro',
  'Jurídico',
  'Técnico',
  'Comercial',
  'Outro',
] as const;

// Status de Atendimento
export const STATUS_ATENDIMENTO = [
  'Novo',
  'Em Andamento',
  'Aguardando',
  'Concluído',
  'Cancelado',
] as const;

// Status de Tarefa
export const STATUS_TAREFA = [
  'Pendente',
  'Em andamento',
  'Concluída',
  'Atrasada',
] as const;

// Prioridades
export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'] as const;

// Categorias de Tarefas
export const CATEGORIAS_TAREFA = [
  'Geral',
  'Documentação',
  'Financeiro',
  'Jurídico',
  'Relatórios',
  'Atendimento ao Cliente',
  'Administrativo',
] as const;

// Tipos de Arquivo Aceitos
export const ACCEPTED_FILE_TYPES = {
  documents: '.pdf,.doc,.docx',
  images: '.jpg,.jpeg,.png,.gif',
  spreadsheets: '.xlsx,.xls,.csv',
  all: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.csv',
} as const;

// Tamanho máximo de arquivo (em bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Limites de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Períodos para filtros
export const PERIODOS = [
  { value: '7dias', label: 'Últimos 7 dias' },
  { value: '30dias', label: 'Últimos 30 dias' },
  { value: '90dias', label: 'Últimos 90 dias' },
  { value: 'ano', label: 'Último ano' },
  { value: 'custom', label: 'Período personalizado' },
] as const;

// Roles de Usuário
export const USER_ROLES = {
  admin: 'Administrador',
  user: 'Usuário',
  manager: 'Gerente',
} as const;

// Formato de Data
export const DATE_FORMAT = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD/MM/YYYY HH:mm',
  FULL: 'DD [de] MMMM [de] YYYY',
} as const;

// Mensagens de Sucesso
export const SUCCESS_MESSAGES = {
  ATENDIMENTO_CRIADO: 'Atendimento criado com sucesso!',
  ATENDIMENTO_ATUALIZADO: 'Atendimento atualizado com sucesso!',
  ATENDIMENTO_EXCLUIDO: 'Atendimento excluído com sucesso!',
  TAREFA_CRIADA: 'Tarefa criada com sucesso!',
  TAREFA_ATUALIZADA: 'Tarefa atualizada com sucesso!',
  TAREFA_EXCLUIDA: 'Tarefa excluída com sucesso!',
  TAREFA_CONCLUIDA: 'Tarefa concluída! 🎉',
  DOCUMENTO_ENVIADO: 'Documento enviado com sucesso!',
  DOCUMENTO_EXCLUIDO: 'Documento excluído com sucesso!',
  LOGIN_SUCESSO: 'Login realizado com sucesso!',
  LOGOUT_SUCESSO: 'Logout realizado com sucesso!',
} as const;

// Mensagens de Erro
export const ERROR_MESSAGES = {
  CAMPO_OBRIGATORIO: 'Este campo é obrigatório',
  EMAIL_INVALIDO: 'E-mail inválido',
  TELEFONE_INVALIDO: 'Telefone inválido',
  SENHA_CURTA: 'Senha deve ter no mínimo 6 caracteres',
  ARQUIVO_GRANDE: 'Arquivo muito grande (máx. 10MB)',
  FORMATO_INVALIDO: 'Formato de arquivo não suportado',
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
  ERRO_REDE: 'Erro de conexão. Verifique sua internet.',
} as const;

// Textos de Empty State
export const EMPTY_STATES = {
  ATENDIMENTOS: {
    title: 'Nenhum atendimento encontrado',
    description: 'Comece criando seu primeiro atendimento no sistema',
  },
  TAREFAS: {
    title: 'Nenhuma tarefa encontrada',
    description: 'Crie tarefas para organizar seu trabalho',
  },
  DOCUMENTOS: {
    title: 'Nenhum documento encontrado',
    description: 'Faça upload de documentos para começar',
  },
  NOTIFICACOES: {
    title: 'Nenhuma notificação',
    description: 'Você está em dia! Sem notificações pendentes',
  },
  BUSCA: {
    title: 'Nenhum resultado encontrado',
    description: 'Tente ajustar seus filtros de busca',
  },
} as const;

// Ícones por tipo de atividade
export const ACTIVITY_ICONS = {
  atendimento: 'FileText',
  tarefa: 'CheckSquare',
  documento: 'FolderOpen',
  sistema: 'Settings',
} as const;

// Configurações de Animação
export const ANIMATION = {
  DURATION: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  DELAY: {
    stagger: 0.05,
    normal: 0.1,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'rgflow_user',
  THEME: 'rgflow_theme',
  PREFERENCES: 'rgflow_preferences',
} as const;

// Query Keys (para React Query se implementado)
export const QUERY_KEYS = {
  ATENDIMENTOS: 'atendimentos',
  TAREFAS: 'tarefas',
  DOCUMENTOS: 'documentos',
  NOTIFICACOES: 'notificacoes',
  USUARIO: 'usuario',
} as const;

export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  COLORS,
  STATUS_COLORS,
  PRIORIDADE_COLORS,
  TIPOS_ATENDIMENTO,
  STATUS_ATENDIMENTO,
  STATUS_TAREFA,
  PRIORIDADES,
  CATEGORIAS_TAREFA,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  EMPTY_STATES,
};
