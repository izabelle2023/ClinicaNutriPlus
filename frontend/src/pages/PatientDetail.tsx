import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import EvolutionChart, { EvolutionPoint } from '../components/EvolutionChart';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  goal: string | null;
  height_cm: number | null;
  initial_weight: number | null;
  birth_date: string | null;
}

interface MealPlan {
  id: number;
  title: string;
  description: string;
  calories_target: number | null;
  active: number;
  created_at: string;
}

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [evolutions, setEvolutions] = useState<EvolutionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planCalories, setPlanCalories] = useState('');

  const [showEvoForm, setShowEvoForm] = useState(false);
  const [evoDate, setEvoDate] = useState('');
  const [evoWeight, setEvoWeight] = useState('');
  const [evoBodyFat, setEvoBodyFat] = useState('');
  const [evoWaist, setEvoWaist] = useState('');

  async function loadAll() {
    const [patientRes, plansRes, evoRes] = await Promise.all([
      api.get(`/patients/${id}`),
      api.get(`/meal-plans/patient/${id}`),
      api.get(`/evolutions/patient/${id}`)
    ]);
    setPatient(patientRes.data);
    setMealPlans(plansRes.data);
    setEvolutions(evoRes.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/meal-plans', {
      patientId: id,
      title: planTitle,
      description: planDescription,
      caloriesTarget: planCalories ? Number(planCalories) : undefined
    });
    setPlanTitle(''); setPlanDescription(''); setPlanCalories('');
    setShowPlanForm(false);
    loadAll();
  }

  async function handleCreateEvolution(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/evolutions', {
      patientId: id,
      recordDate: evoDate,
      weight: evoWeight ? Number(evoWeight) : undefined,
      bodyFat: evoBodyFat ? Number(evoBodyFat) : undefined,
      waistCm: evoWaist ? Number(evoWaist) : undefined
    });
    setEvoDate(''); setEvoWeight(''); setEvoBodyFat(''); setEvoWaist('');
    setShowEvoForm(false);
    loadAll();
  }

  if (loading || !patient) return <div className="page-loading">Carregando paciente...</div>;

  return (
    <div className="page">
      <h1>{patient.name}</h1>
      <p className="subtitle">{patient.email} {patient.phone ? `· ${patient.phone}` : ''}</p>

      <div className="cards-grid">
        <div className="card stat-card">
          <span className="stat-value">{patient.height_cm ? `${patient.height_cm} cm` : '-'}</span>
          <span className="stat-label">Altura</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{patient.initial_weight ? `${patient.initial_weight} kg` : '-'}</span>
          <span className="stat-label">Peso inicial</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{patient.goal || '-'}</span>
          <span className="stat-label">Objetivo</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h2>Evolucao</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setShowEvoForm(!showEvoForm)}>
            {showEvoForm ? 'Cancelar' : '+ Novo registro'}
          </button>
        </div>

        {showEvoForm && (
          <form className="inline-form" onSubmit={handleCreateEvolution}>
            <label>Data
              <input type="date" value={evoDate} onChange={(e) => setEvoDate(e.target.value)} required />
            </label>
            <label>Peso (kg)
              <input type="number" step="0.1" value={evoWeight} onChange={(e) => setEvoWeight(e.target.value)} />
            </label>
            <label>% Gordura
              <input type="number" step="0.1" value={evoBodyFat} onChange={(e) => setEvoBodyFat(e.target.value)} />
            </label>
            <label>Cintura (cm)
              <input type="number" step="0.1" value={evoWaist} onChange={(e) => setEvoWaist(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        )}

        <EvolutionChart data={evolutions} />
      </div>

      <div className="card">
        <div className="card-header-row">
          <h2>Planos alimentares</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setShowPlanForm(!showPlanForm)}>
            {showPlanForm ? 'Cancelar' : '+ Novo plano'}
          </button>
        </div>

        {showPlanForm && (
          <form className="inline-form-column" onSubmit={handleCreatePlan}>
            <label>Titulo
              <input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} required />
            </label>
            <label>Descricao (refeicoes, orientacoes...)
              <textarea value={planDescription} onChange={(e) => setPlanDescription(e.target.value)} rows={5} required />
            </label>
            <label>Meta calorica (kcal)
              <input type="number" value={planCalories} onChange={(e) => setPlanCalories(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary">Salvar plano</button>
          </form>
        )}

        {mealPlans.length === 0 && <p className="empty-state">Nenhum plano alimentar cadastrado.</p>}
        <ul className="list">
          {mealPlans.map((plan) => (
            <li key={plan.id} className="meal-plan-item">
              <div className="meal-plan-header">
                <strong>{plan.title}</strong>
                {plan.active === 1 && <span className="badge badge-active">Ativo</span>}
              </div>
              <p>{plan.description}</p>
              {plan.calories_target && <span className="muted">Meta: {plan.calories_target} kcal/dia</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
