'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bus, LogOut, Users, Settings, User, Plus, Play, X, Check, UserPlus, List, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Student } from '@/lib/types';

export default function DriverDashboard() {
  const { state, dispatch } = useApp();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');
  const [newRouteName, setNewRouteName] = useState('');
  const [selectedStudentsForToday, setSelectedStudentsForToday] = useState<string[]>([]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleRouteSelect = (routeId: string) => {
    dispatch({ type: 'SELECT_ROUTE', payload: routeId });
  };

  const handleAddRoute = () => {
    if (!newRouteName.trim()) return;

    dispatch({
      type: 'ADD_ROUTE',
      payload: {
        id: Date.now().toString(),
        name: newRouteName.trim(),
        students: [],
        allStudents: [],
        currentStudent: 0,
        isActive: false,
        points: [],
        currentLocation: 0
      }
    });

    setNewRouteName('');
    setShowAddRoute(false);
  };

  const handleDeleteRoute = (routeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_ROUTE', payload: routeId });
    }
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentAddress.trim() || !state.selectedRoute) return;

    const selectedRoute = state.routes.find(route => route.id === state.selectedRoute);
    if (!selectedRoute) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      address: newStudentAddress.trim(),
      order: (selectedRoute.allStudents?.length || 0) + 1,
      status: 'waiting'
    };

    dispatch({
      type: 'ADD_STUDENT_TO_ROUTE',
      payload: { routeId: state.selectedRoute, student: newStudent }
    });

    setNewStudentName('');
    setNewStudentAddress('');
    setShowAddStudent(false);
  };

  const handleDeleteStudent = (studentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.selectedRoute) return;
    
    if (confirm('Tem certeza que deseja excluir este aluno? Ele será removido da lista de seleção rápida.')) {
      dispatch({
        type: 'DELETE_STUDENT_FROM_ROUTE',
        payload: { routeId: state.selectedRoute, studentId }
      });
      
      // Remove o aluno da seleção do dia se estiver selecionado
      setSelectedStudentsForToday(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleStartRoute = () => {
    if (!state.selectedRoute || selectedStudentsForToday.length === 0) return;

    dispatch({
      type: 'START_ROUTE_FLOW',
      payload: { routeId: state.selectedRoute, studentIds: selectedStudentsForToday }
    });

    setShowStudentSelection(false);
    setSelectedStudentsForToday([]);
  };

  const handleStudentStatus = (studentId: string, status: 'picked' | 'not_answered') => {
    if (!state.selectedRoute) return;

    dispatch({
      type: 'UPDATE_STUDENT_STATUS',
      payload: { routeId: state.selectedRoute, studentId, status }
    });
  };

  const selectedRoute = state.routes.find(route => route.id === state.selectedRoute);
  const currentStudent = selectedRoute?.students[selectedRoute.currentStudent || 0];
  
  // Lógica corrigida para detectar quando a rota está finalizada
  const isRouteFinished = selectedRoute?.isActive && 
    selectedRoute?.students && 
    selectedRoute.students.length > 0 &&
    selectedRoute.students.every(student => student.status === 'picked' || student.status === 'not_answered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black text-white shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Bus className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CAAT</h1>
              <p className="text-sm text-yellow-400">Painel do Condutor</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">
                Gerenciar Rotas
              </h2>
              <p className="text-gray-300">
                Selecione uma rota para gerenciar os alunos ou cadastre uma nova rota
              </p>
            </div>

            {/* Botão Cadastrar Nova Rota */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowAddRoute(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Nova Rota
              </Button>
            </div>

            {/* Modal Cadastrar Rota */}
            {showAddRoute && (
              <Card className="bg-gray-800 border-yellow-400 border-2 max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
                      Cadastrar Nova Rota
                    </span>
                    <Button
                      onClick={() => setShowAddRoute(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome da Rota
                    </label>
                    <Input
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      placeholder="Digite o nome da rota"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAddRoute}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                      disabled={!newRouteName.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar
                    </Button>
                    <Button
                      onClick={() => setShowAddRoute(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Rotas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.routes.map((route) => {
                const totalStudents = route.allStudents?.length || 0;
                const activeStudents = route.students?.length || 0;
                return (
                  <Card 
                    key={route.id} 
                    className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-all relative cursor-pointer"
                    onClick={() => handleRouteSelect(route.id)}
                  >
                    <Button
                      onClick={(e) => handleDeleteRoute(route.id, e)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-black" />
                      </div>
                      <CardTitle className="text-xl text-white">{route.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {totalStudents} alunos cadastrados
                        {activeStudents > 0 && (
                          <span className="block text-yellow-400 text-sm mt-1">
                            {activeStudents} alunos ativos hoje
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button 
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Gerenciar Rota
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Mensagem quando não há rotas */}
            {state.routes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma rota cadastrada</h3>
                <p className="text-gray-400 mb-6">
                  Comece cadastrando sua primeira rota de transporte escolar
                </p>
                <Button
                  onClick={() => setShowAddRoute(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeira Rota
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedRoute.name}</h2>
                <div className="flex items-center space-x-2 text-gray-300 mt-1">
                  <User className="w-4 h-4" />
                  <span>
                    {selectedRoute.allStudents?.length || 0} alunos cadastrados | 
                    {selectedRoute.students?.length || 0} alunos ativos
                  </span>
                </div>
              </div>
              <Button
                onClick={() => dispatch({ type: 'SELECT_ROUTE', payload: null })}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Voltar às Rotas
              </Button>
            </div>

            {/* Mensagem de Rota Finalizada */}
            {isRouteFinished && (
              <Card className="bg-green-800 border-green-400 border-2">
                <CardHeader>
                  <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
                    <Check className="w-6 h-6 text-green-400" />
                    <span>Rota Finalizada com Sucesso!</span>
                  </CardTitle>
                  <CardDescription className="text-green-200 text-center">
                    Todos os alunos foram atendidos. A rota foi concluída com sucesso.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setShowAddStudent(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Cadastrar Aluno
              </Button>
              
              <Button
                onClick={() => setShowStudentSelection(true)}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black h-12"
                disabled={!selectedRoute.allStudents || selectedRoute.allStudents.length === 0}
              >
                <List className="w-5 h-5 mr-2" />
                Selecionar Alunos do Dia
              </Button>

              <Button
                onClick={handleStartRoute}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white h-12"
                disabled={!selectedRoute.students || selectedRoute.students.length === 0}
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Fluxo de Busca
              </Button>
            </div>

            {/* Modal Cadastrar Aluno */}
            {showAddStudent && (
              <Card className="bg-gray-800 border-yellow-400 border-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <UserPlus className="w-5 h-5 mr-2 text-yellow-400" />
                      Cadastrar Novo Aluno
                    </span>
                    <Button
                      onClick={() => setShowAddStudent(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome do Aluno
                    </label>
                    <Input
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Digite o nome completo"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Endereço
                    </label>
                    <Input
                      value={newStudentAddress}
                      onChange={(e) => setNewStudentAddress(e.target.value)}
                      placeholder="Digite o endereço completo"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAddStudent}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                      disabled={!newStudentName.trim() || !newStudentAddress.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar
                    </Button>
                    <Button
                      onClick={() => setShowAddStudent(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modal Seleção de Alunos */}
            {showStudentSelection && (
              <Card className="bg-gray-800 border-yellow-400 border-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <List className="w-5 h-5 mr-2 text-yellow-400" />
                      Selecionar Alunos para Hoje
                    </span>
                    <Button
                      onClick={() => setShowStudentSelection(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Selecione os alunos que irão à escola hoje na ordem de busca
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedRoute.allStudents?.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStudentsForToday.includes(student.id)
                            ? 'bg-yellow-400 text-black border-yellow-500'
                            : 'bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => {
                          if (selectedStudentsForToday.includes(student.id)) {
                            setSelectedStudentsForToday(prev => prev.filter(id => id !== student.id));
                          } else {
                            setSelectedStudentsForToday(prev => [...prev, student.id]);
                          }
                        }}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedStudentsForToday.includes(student.id)
                            ? 'bg-black border-black'
                            : 'border-gray-400'
                        }`}>
                          {selectedStudentsForToday.includes(student.id) && (
                            <Check className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm opacity-75">{student.address}</p>
                        </div>
                        {selectedStudentsForToday.includes(student.id) && (
                          <div className="text-sm font-medium">
                            #{selectedStudentsForToday.indexOf(student.id) + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button
                      onClick={handleStartRoute}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={selectedStudentsForToday.length === 0}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar com {selectedStudentsForToday.length} alunos
                    </Button>
                    <Button
                      onClick={() => setShowStudentSelection(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Alunos Cadastrados */}
            {selectedRoute.allStudents && selectedRoute.allStudents.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Alunos Cadastrados na Rota</CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedRoute.allStudents.length} alunos cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {selectedRoute.allStudents.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-sm text-gray-400">{student.address}</p>
                        </div>
                        <Button
                          onClick={(e) => handleDeleteStudent(student.id, e)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fluxo de Busca Ativo */}
            {selectedRoute.isActive && selectedRoute.students && selectedRoute.students.length > 0 && !isRouteFinished && (
              <Card className="bg-gray-800 border-yellow-400 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Play className="w-5 h-5 text-yellow-400" />
                    <span>Fluxo de Busca Ativo</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Aluno atual: <strong className="text-yellow-400">{currentStudent?.name}</strong>
                    <br />
                    <span className="text-sm">Marque se o aluno atendeu ou não o chamado</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStudent && (
                    <div className="bg-yellow-400 text-black p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                        <div className="text-center sm:text-left">
                          <h3 className="font-bold text-lg">{currentStudent.name}</h3>
                          <p className="text-sm">{currentStudent.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleStudentStatus(currentStudent.id, 'not_answered')}
                            className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 p-0 rounded-full"
                            size="sm"
                          >
                            <X className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={() => handleStudentStatus(currentStudent.id, 'picked')}
                            className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 p-0 rounded-full"
                            size="sm"
                          >
                            <Check className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {selectedRoute.students.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          index === selectedRoute.currentStudent
                            ? 'bg-yellow-400 text-black'
                            : student.status === 'picked'
                            ? 'bg-green-700 text-white'
                            : student.status === 'not_answered'
                            ? 'bg-red-700 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === selectedRoute.currentStudent
                              ? 'bg-black text-yellow-400'
                              : student.status === 'picked'
                              ? 'bg-green-900 text-green-300'
                              : student.status === 'not_answered'
                              ? 'bg-red-900 text-red-300'
                              : 'bg-yellow-400 text-black'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm opacity-75">{student.address}</p>
                        </div>
                        <div className="text-sm font-medium">
                          {index === selectedRoute.currentStudent && '👤 Atual'}
                          {student.status === 'picked' && '✓ Atendeu'}
                          {student.status === 'not_answered' && '✗ Não Atendeu'}
                          {!student.status && index > (selectedRoute.currentStudent || 0) && '⏳ Aguardando'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}