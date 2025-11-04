'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/app-context';
import { UserType } from '@/lib/types';
import { Bus, User, Lock } from 'lucide-react';

export default function LoginForm() {
  const { dispatch } = useApp();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedType) {
      setError('Selecione o tipo de usuário');
      return;
    }

    const correctPassword = selectedType === 'aluno' ? 'passageiro123' : 'condutor123';
    
    if (password !== correctPassword) {
      setError('Senha incorreta');
      return;
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        type: selectedType,
        isAuthenticated: true
      }
    });
  };

  const resetForm = () => {
    setSelectedType(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-yellow-400 border-2 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5a3892e4-6eab-4706-a221-4bf5689da20b.jpg" 
              alt="Logo CAAT" 
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-black">CAAT</CardTitle>
          <CardDescription className="text-gray-600">
            Sistema de Rastreamento de Van Escolar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!selectedType ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-black">
                Selecione o tipo de acesso:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={() => setSelectedType('aluno')}
                  className="h-16 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg border-2 border-black"
                  variant="outline"
                >
                  <User className="w-6 h-6 mr-2" />
                  Login Aluno
                </Button>
                <Button
                  onClick={() => setSelectedType('condutor')}
                  className="h-16 bg-black hover:bg-gray-800 text-white font-semibold text-lg border-2 border-yellow-400"
                >
                  <Bus className="w-6 h-6 mr-2" />
                  Login Condutor
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black">
                  {selectedType === 'aluno' ? 'Acesso do Aluno' : 'Acesso do Condutor'}
                </h3>
                <p className="text-sm text-gray-600">
                  Digite sua senha para continuar
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleLogin}
                  className={`flex-1 ${
                    selectedType === 'aluno'
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Entrar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}