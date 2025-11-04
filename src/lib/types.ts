export type UserType = 'aluno' | 'condutor';

export interface User {
  type: UserType;
  isAuthenticated: boolean;
}

export interface Student {
  id: string;
  name: string;
  address: string;
  order: number; // ordem na rota
  status?: 'waiting' | 'picked' | 'not_answered'; // status do aluno
}

export interface Route {
  id: string;
  name: string;
  students: Student[];
  currentStudent?: number; // índice do aluno atual
  points: RoutePoint[]; // mantemos para compatibilidade, mas não usaremos mais
  currentLocation?: number; // mantemos para compatibilidade
  allStudents?: Student[]; // lista completa de alunos cadastrados na rota
  todayStudents?: string[]; // IDs dos alunos selecionados para hoje
  isActive?: boolean; // se o fluxo de busca está ativo
}

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export interface AppState {
  user: User | null;
  routes: Route[];
  selectedRoute: string | null;
}