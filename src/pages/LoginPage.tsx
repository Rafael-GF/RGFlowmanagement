import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { toast } from 'sonner@2.0.3';

export default function LoginPage() {
  const { setUsuario, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};
    
    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUsuario({
      id: '1',
      nome: 'Admin RGFlow',
      email: email,
      role: 'admin',
    });
    
    setCurrentPage('dashboard');
    setLoading(false);
    
    toast.success('Login realizado com sucesso!', {
      description: 'Bem-vindo ao RGFlow Management',
    });
  };

  const handleForgotPassword = () => {
    toast.info('Recuperação de senha', {
      description: 'Link de recuperação enviado para seu e-mail',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#1F3A93]/5 to-[#28A745]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#28A745]/5 to-[#1F3A93]/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-gray-200 dark:border-gray-700"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#1F3A93] to-[#28A745] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl">RF</span>
          </div>
          <h1 className="text-[#1F3A93] dark:text-blue-400 mb-2">RGFlow Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Sistema de Gestão Empresarial</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: undefined });
            }}
            placeholder="seu@email.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email}
            disabled={loading}
          />

          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErrors({ ...errors, senha: undefined });
              }}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.senha}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-[#1F3A93] focus:ring-[#1F3A93]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Lembrar-me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#1F3A93] dark:text-blue-400 hover:underline"
            >
              Esqueci a senha
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            icon={loading ? undefined : <Lock className="w-5 h-5" />}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <button className="text-[#1F3A93] dark:text-blue-400 hover:underline">
              Solicitar acesso
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 RGFlow Management. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Versão 2.0.0 Enterprise
          </p>
        </div>
      </motion.div>
    </div>
  );
}
