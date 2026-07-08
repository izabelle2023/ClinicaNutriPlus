import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface MealPlan {
  id: number;
  title: string;
  description: string;
  calories_target: number | null;
  active: number;
  created_at: string;
}

export default function MealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await api.get('/auth/me');
      const patient = meRes.data.patient;
      if (patient) {
        const { data } = await api.get(`/meal-plans/patient/${patient.id}`);
        setPlans(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="page-loading">Carregando plano alimentar...</div>;

  return (
    <div className="page">
      <h1>Meu Plano Alimentar</h1>

      {plans.length === 0 && (
        <p className="empty-state">Seu nutricionista ainda nao cadastrou um plano alimentar.</p>
      )}

      {plans.map((plan) => (
        <div className="card" key={plan.id}>
          <div className="meal-plan-header">
            <h2>{plan.title}</h2>
            {plan.active === 1 && <span className="badge badge-active">Ativo</span>}
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{plan.description}</p>
          {plan.calories_target && <p className="muted">Meta calorica: {plan.calories_target} kcal/dia</p>}
          <p className="muted">Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      ))}
    </div>
  );
}
