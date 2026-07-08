import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Patient {
  id: number;
  name: string;
  email: string;
  goal: string | null;
}

interface Appointment {
  id: number;
  patient_name: string;
  date_time: string;
  status: string;
}

export default function DashboardNutricionista() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments')
        ]);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcoming = appointments.filter((a) => a.status === 'agendada').slice(0, 5);

  if (loading) return <div className="page-loading">Carregando dashboard...</div>;

  return (
    <div className="page">
      <h1>Ola, {user?.name} 👋</h1>
      <p className="subtitle">Aqui esta um resumo da sua clinica hoje.</p>

      <div className="cards-grid">
        <div className="card stat-card">
          <span className="stat-value">{patients.length}</span>
          <span className="stat-label">Pacientes ativos</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{appointments.filter((a) => a.status === 'agendada').length}</span>
          <span className="stat-label">Consultas agendadas</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{appointments.filter((a) => a.status === 'concluida').length}</span>
          <span className="stat-label">Consultas concluidas</span>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h2>Proximas consultas</h2>
          {upcoming.length === 0 && <p className="empty-state">Nenhuma consulta agendada.</p>}
          <ul className="list">
            {upcoming.map((a) => (
              <li key={a.id}><strong>{a.patient_name}</strong> — {new Date(a.date_time).toLocaleString('pt-BR')}</li>
            ))}
          </ul>
          <Link to="/consultas" className="btn btn-outline">Ver todas as consultas</Link>
        </div>

        <div className="card">
          <h2>Pacientes recentes</h2>
          {patients.length === 0 && <p className="empty-state">Nenhum paciente cadastrado ainda.</p>}
          <ul className="list">
            {patients.slice(0, 5).map((p) => (
              <li key={p.id}><strong>{p.name}</strong> {p.goal ? `— ${p.goal}` : ''}</li>
            ))}
          </ul>
          <Link to="/pacientes" className="btn btn-outline">Ver todos os pacientes</Link>
        </div>
      </div>
    </div>
  );
}
