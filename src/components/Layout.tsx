import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Bell, User, LogOut, 
  LayoutDashboard, FileText, CheckSquare, 
  FolderOpen, BarChart3, Moon, Sun, Settings
} from 'lucide-react';
import { useApp, Page } from '../contexts/AppContext';
import Badge from './ui/Badge';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { 
    currentPage, 
    setCurrentPage, 
    usuario, 
    setUsuario, 
    notificacoes,
    marcarNotificacaoLida,
    darkMode,
    toggleDarkMode
  } = useApp();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', page: 'dashboard' as Page, icon: LayoutDashboard },
    { label: 'Atendimentos', page: 'pre-atendimento' as Page, icon: FileText },
    { label: 'Tarefas', page: 'tarefas' as Page, icon: CheckSquare },
    { label: 'Documentos', page: 'documentos' as Page, icon: FolderOpen },
    { label: 'Relatórios', page: 'relatorios' as Page, icon: BarChart3 },
  ];

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const handleLogout = () => {
    setUsuario(null);
    setCurrentPage('login');
  };

  const getNotificationIcon = (tipo: string) => {
    const colors = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
    };
    return colors[tipo as keyof typeof colors] || colors.info;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Menu Mobile */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-lg flex items-center justify-center">
                  <span className="text-white">RF</span>
                </div>
                <h1 className="text-[#1F3A93] dark:text-blue-400 hidden sm:block">
                  RGFlow Management
                </h1>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Notificações */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificacoesOpen(!notificacoesOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificacoesNaoLidas > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificacoesNaoLidas}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notificacoesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3>Notificações</h3>
                      </div>
                      {notificacoes.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notificacoes.map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                marcarNotificacaoLida(notif.id);
                                setNotificacoesOpen(false);
                              }}
                              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                !notif.lida ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <Bell className={`w-5 h-5 mt-0.5 ${getNotificationIcon(notif.tipo)}`} />
                                <div className="flex-1">
                                  <p className="text-gray-900 dark:text-gray-100">{notif.titulo}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.mensagem}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {new Date(notif.data).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Perfil */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPerfilOpen(!perfilOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-gray-700 dark:text-gray-300">{usuario?.nome}</span>
                </motion.button>

                <AnimatePresence>
                  {perfilOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-gray-100">{usuario?.nome}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{usuario?.email}</p>
                        <Badge variant="primary" size="sm" className="mt-2">
                          {usuario?.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </Badge>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                          Configurações
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(menuOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed lg:sticky top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30"
            >
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page;
                    return (
                      <li key={item.page}>
                        <motion.button
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCurrentPage(item.page);
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-[#1F3A93] to-[#28A745] text-white shadow-md'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
