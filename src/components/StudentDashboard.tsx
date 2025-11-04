'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, LogOut, Users, Clock, User, Check } from 'lucide-react';

export default function StudentDashboard() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleRouteSelect = (routeId: string) => {
    dispatch({ type: 'SELECT_ROUTE', payload: routeId });
  };

  const selectedRoute = state.routes.find(route => route.id === state.selectedRoute);
  const currentStudent = selectedRoute?.students[selectedRoute.currentStudent || 0];
  const isRouteFinished = selectedRoute?.isActive && selectedRoute?.students && 
    (selectedRoute.currentStudent || 0) >= selectedRoute.students.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Bus className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CAAT</h1>
              <p className="text-sm text-gray-300">Área do Aluno</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!state.selectedRoute ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-2">
                Selecione sua Rota
              </h2>
              <p className="text-gray-600">
                Escolha a rota da van para acompanhar qual aluno será o próximo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.routes.map((route) => {
                const currentStudent = route.students[route.currentStudent || 0];
                return (
                  <Card 
                    key={route.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-yellow-400"
                    onClick={() => handleRouteSelect(route.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-black" />
                      </div>
                      <CardTitle className="text-xl text-black">{route.name}</CardTitle>
                      <CardDescription>
                        {route.students.length} alunos na rota
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Próximo aluno:</p>
                        <p className="font-semibold text-black">{currentStudent?.name || 'Nenhum aluno ativo'}</p>
                      </div>
                      <Button 
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      >
                        Ver Lista de Alunos
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-black">{selectedRoute.name}</h2>
                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>Lista de alunos atualizada em tempo real</span>
                </div>
              </div>
              <Button
                onClick={() => dispatch({ type: 'SELECT_ROUTE', payload: null })}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Voltar às Rotas
              </Button>
            </div>

            {/* Mensagem de Rota Finalizada */}
            {isRouteFinished && (
              <Card className="border-2 border-green-400 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 text-center flex items-center justify-center space-x-2">
                    <Check className="w-6 h-6 text-green-600" />
                    <span>Rota Finalizada!</span>
                  </CardTitle>
                  <CardDescription className="text-green-700 text-center">
                    Todos os alunos foram atendidos. A rota foi concluída com sucesso.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {selectedRoute.students && selectedRoute.students.length > 0 && !isRouteFinished && (
              <Card className="border-2 border-yellow-400">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-yellow-600" />
                    <span>Aluno do Momento</span>
                  </CardTitle>
                  <CardDescription>
                    O próximo aluno a ser buscado/deixado é: <strong>{currentStudent?.name}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black">{currentStudent?.name}</h3>
                        <p className="text-gray-600">{currentStudent?.address}</p>
                        <p className="text-sm text-yellow-700 font-medium mt-1">
                          👤 Este é o aluno do momento
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedRoute.students && selectedRoute.students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lista Completa de Alunos</CardTitle>
                  <CardDescription>Ordem de busca/entrega dos alunos nesta rota</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRoute.students.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          index === selectedRoute.currentStudent
                            ? 'bg-yellow-100 border-2 border-yellow-400'
                            : student.status === 'picked'
                            ? 'bg-green-100 border border-green-300'
                            : student.status === 'not_answered'
                            ? 'bg-red-100 border border-red-300'
                            : index < (selectedRoute.currentStudent || 0)
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            index === selectedRoute.currentStudent
                              ? 'bg-yellow-400 text-black'
                              : student.status === 'picked'
                              ? 'bg-green-500 text-white'
                              : student.status === 'not_answered'
                              ? 'bg-red-500 text-white'
                              : index < (selectedRoute.currentStudent || 0)
                              ? 'bg-gray-300 text-gray-600'
                              : 'bg-black text-white'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.address}</p>
                          {index === selectedRoute.currentStudent && (
                            <p className="text-sm text-yellow-600 font-medium">👤 Aluno do momento!</p>
                          )}
                          {student.status === 'picked' && (
                            <p className="text-sm text-green-600 font-medium">✓ Já foi atendido</p>
                          )}
                          {student.status === 'not_answered' && (
                            <p className="text-sm text-red-600 font-medium">✗ Não atendeu o chamado</p>
                          )}
                          {!student.status && index > (selectedRoute.currentStudent || 0) && (
                            <p className="text-sm text-gray-600">⏳ Aguardando</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(!selectedRoute.students || selectedRoute.students.length === 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhum Aluno Ativo</CardTitle>
                  <CardDescription>
                    Não há alunos selecionados para hoje nesta rota.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    O condutor ainda não selecionou os alunos que irão à escola hoje.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}