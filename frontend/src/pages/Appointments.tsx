import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id: number;
  patient_name?: string;
  nutritionist_name?: string;
  date_time: string;
  status: 'agendada' | 'concluida' | 'cancelada';
  notes: string | null;
}

interface Patient { id: number; name: string; }

export default function Appointments() {
  const { user } = useAuth();
  const isNutri = user?.role === 'nutricionista';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');

  async function load() {
    const appointmentsRes = await api.get('/appointments');
    setAppointments(appointmentsRes.data);
    if (isNutri) {
      const patientsRes = await api.get('/patients');
      setPatients(patientsRes.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/appointments', { patientId, dateTime, notes });
    setPatientId(''); setDateTime(''); setNotes('');
    setShowForm(false);
    load();
  }

  async function updateStatus(id: number, status: string) {
    await api.patch(`/appointments/${id}/status`, { status });
    load();
  }

  if (loading) return <div className="page-loading">Carregando consultas...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isNutri ? 'Consultas' : 'Minhas Consultas'}</h1>
        {isNutri && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Agendar consulta'}
          </button>
        )}
      </div>

      {isNutri && showForm && (
        <form className="inline-form" onSubmit={handleCreate}>
          <label>Paciente
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
              <option value="">Selecione...</option>
              {patients.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </label>
          <label>Data e hora
            <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
          </label>
          <label>Observacoes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary">Agendar</button>
        </form>
      )}

      {appointments.length === 0 && <p className="empty-state">Nenhuma consulta encontrada.</p>}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{isNutri ? 'Paciente' : 'Nutricionista'}</th>
              <th>Data</th>
              <th>Status</th>
              {isNutri && <th></th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{isNutri ? a.patient_name : a.nutritionist_name}</td>
                <td>{new Date(a.date_time).toLocaleString('pt-BR')}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                {isNutri && (
                  <td>
                    {a.status === 'agendada' && (
                      <>
                        <button className="btn btn-sm btn-outline" onClick={() => updateStatus(a.id, 'concluida')}>Concluir</button>{' '}
                        <button className="btn btn-sm btn-outline" onClick={() => updateStatus(a.id, 'cancelada')}>Cancelar</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
