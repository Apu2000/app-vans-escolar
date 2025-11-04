'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, Route, Student } from './types';

// Estado inicial limpo - sem rotas pré-cadastradas
const initialState: AppState = {
  user: null,
  routes: [],
  selectedRoute: null
};

type Action = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_ROUTE'; payload: string | null }
  | { type: 'UPDATE_LOCATION'; payload: { routeId: string; locationIndex: number } }
  | { type: 'UPDATE_CURRENT_STUDENT'; payload: { routeId: string; studentIndex: number } }
  | { type: 'ADD_STUDENT_TO_ROUTE'; payload: { routeId: string; student: Student } }
  | { type: 'DELETE_STUDENT_FROM_ROUTE'; payload: { routeId: string; studentId: string } }
  | { type: 'ADD_ROUTE'; payload: Route }
  | { type: 'DELETE_ROUTE'; payload: string }
  | { type: 'START_ROUTE_FLOW'; payload: { routeId: string; studentIds: string[] } }
  | { type: 'UPDATE_STUDENT_STATUS'; payload: { routeId: string; studentId: string; status: 'picked' | 'not_answered' } }
  | { type: 'NEXT_STUDENT'; payload: { routeId: string } };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, selectedRoute: null };
    case 'SELECT_ROUTE':
      return { ...state, selectedRoute: action.payload };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.id === action.payload.routeId
            ? { ...route, currentLocation: action.payload.locationIndex }
            : route
        )
      };
    case 'UPDATE_CURRENT_STUDENT':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.id === action.payload.routeId
            ? { ...route, currentStudent: action.payload.studentIndex }
            : route
        )
      };
    case 'ADD_STUDENT_TO_ROUTE':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.id === action.payload.routeId
            ? { 
                ...route, 
                allStudents: [...(route.allStudents || []), action.payload.student]
              }
            : route
        )
      };
    case 'DELETE_STUDENT_FROM_ROUTE':
      return {
        ...state,
        routes: state.routes.map(route => {
          if (route.id !== action.payload.routeId) return route;
          
          return {
            ...route,
            allStudents: (route.allStudents || []).filter(student => student.id !== action.payload.studentId),
            students: (route.students || []).filter(student => student.id !== action.payload.studentId)
          };
        })
      };
    case 'ADD_ROUTE':
      return {
        ...state,
        routes: [...state.routes, action.payload]
      };
    case 'DELETE_ROUTE':
      return {
        ...state,
        routes: state.routes.filter(route => route.id !== action.payload),
        selectedRoute: state.selectedRoute === action.payload ? null : state.selectedRoute
      };
    case 'START_ROUTE_FLOW':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.id === action.payload.routeId
            ? { 
                ...route, 
                students: (route.allStudents || [])
                  .filter(student => action.payload.studentIds.includes(student.id))
                  .sort((a, b) => action.payload.studentIds.indexOf(a.id) - action.payload.studentIds.indexOf(b.id))
                  .map((student, index) => ({ ...student, order: index, status: 'waiting' })),
                currentStudent: 0,
                isActive: true
              }
            : route
        )
      };
    case 'UPDATE_STUDENT_STATUS':
      return {
        ...state,
        routes: state.routes.map(route => {
          if (route.id !== action.payload.routeId) return route;
          
          const updatedStudents = (route.students || []).map(student =>
            student.id === action.payload.studentId
              ? { ...student, status: action.payload.status }
              : student
          );
          
          const currentStudentIndex = route.currentStudent || 0;
          const nextStudentIndex = currentStudentIndex < updatedStudents.length - 1 
            ? currentStudentIndex + 1 
            : currentStudentIndex;
          
          return {
            ...route,
            students: updatedStudents,
            currentStudent: nextStudentIndex
          };
        })
      };
    case 'NEXT_STUDENT':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.id === action.payload.routeId
            ? { 
                ...route, 
                currentStudent: Math.min((route.currentStudent || 0) + 1, (route.students || []).length - 1)
              }
            : route
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new error('useApp must be used within AppProvider');
  }
  return context;
}