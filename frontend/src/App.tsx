import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardNutricionista from './pages/DashboardNutricionista';
import DashboardPaciente from './pages/DashboardPaciente';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import MealPlans from './pages/MealPlans';
import Evolution from './pages/Evolution';

function HomeRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'nutricionista' ? <DashboardNutricionista /> : <DashboardPaciente />;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="app-main">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />

          <Route path="/" element={<PrivateRoute><Layout><HomeRoute /></Layout></PrivateRoute>} />

          <Route path="/pacientes" element={<PrivateRoute allow={['nutricionista']}><Layout><Patients /></Layout></PrivateRoute>} />
          <Route path="/pacientes/:id" element={<PrivateRoute allow={['nutricionista']}><Layout><PatientDetail /></Layout></PrivateRoute>} />

          <Route path="/consultas" element={<PrivateRoute><Layout><Appointments /></Layout></PrivateRoute>} />

          <Route path="/plano-alimentar" element={<PrivateRoute allow={['paciente']}><Layout><MealPlans /></Layout></PrivateRoute>} />

          <Route path="/evolucao" element={<PrivateRoute allow={['paciente']}><Layout><Evolution /></Layout></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
