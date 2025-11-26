import { AppProvider, useApp } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PreAtendimentoPage from './pages/PreAtendimentoPage';
import TarefasPage from './pages/TarefasPage';
import DocumentosPage from './pages/DocumentosPage';
import RelatoriosPage from './pages/RelatoriosPage';
import { Toaster } from 'sonner@2.0.3';

function AppContent() {
  const { currentPage, usuario } = useApp();

  if (!usuario) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pre-atendimento':
        return <PreAtendimentoPage />;
      case 'tarefas':
        return <TarefasPage />;
      case 'documentos':
        return <DocumentosPage />;
      case 'relatorios':
        return <RelatoriosPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}
