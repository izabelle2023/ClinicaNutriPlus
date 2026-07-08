import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id: number;
  nutritionist_name: string;
  date_time: string;
  status: string;
}

interface MealPlan {
  id: number;
  title: string;
  active: number;
}

export default function DashboardPaciente() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await api.get('/auth/me');
        const patient = meRes.data.patient;
        const appointmentsRes = await api.get('/appointments');
        setAppointments(appointmentsRes.data);

        if (patient) {
          const mealPlansRes = await api.get(`/meal-plans/patient/${patient.id}`);
          setMealPlans(mealPlansRes.data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const nextAppointment = appointments.find((a) => a.status === 'agendada');
  const activePlan = mealPlans.find((p) => p.active === 1);

  if (loading) return <div className="page-loading">Carregando dashboard...</div>;

  return (
    <div className="page">
      <h1>Ola, {user?.name} 👋</h1>
      <p className="subtitle">Acompanhe sua jornada nutricional.</p>

      <div className="two-col">
        <div className="card">
          <h2>Proxima consulta</h2>
          {nextAppointment ? (
            <p>Com <strong>{nextAppointment.nutritionist_name}</strong> em{' '}
              {new Date(nextAppointment.date_time).toLocaleString('pt-BR')}
            </p>
          ) : (
            <p className="empty-state">Nenhuma consulta agendada no momento.</p>
          )}
          <Link to="/consultas" className="btn btn-outline">Ver minhas consultas</Link>
        </div>

        <div className="card">
          <h2>Plano alimentar atual</h2>
          {activePlan ? (
            <p><strong>{activePlan.title}</strong></p>
          ) : (
            <p className="empty-state">Nenhum plano ativo no momento.</p>
          )}
          <Link to="/plano-alimentar" className="btn btn-outline">Ver plano completo</Link>
        </div>
      </div>

      <div className="card">
        <h2>Minha evolucao</h2>
        <p>Acompanhe o historico de peso, percentual de gordura e medidas.</p>
        <Link to="/evolucao" className="btn btn-primary">Ver minha evolucao</Link>
      </div>
    </div>
  );
}
