import React, { useEffect, useState } from 'react';
import api from '../services/api';
import EvolutionChart, { EvolutionPoint } from '../components/EvolutionChart';

export default function Evolution() {
  const [data, setData] = useState<EvolutionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await api.get('/auth/me');
      const patient = meRes.data.patient;
      if (patient) {
        const { data } = await api.get(`/evolutions/patient/${patient.id}`);
        setData(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="page-loading">Carregando evolucao...</div>;

  const last = data[data.length - 1];
  const first = data[0];

  return (
    <div className="page">
      <h1>Minha Evolucao</h1>

      {first && last && (
        <div className="cards-grid">
          <div className="card stat-card">
            <span className="stat-value">{last.weight ?? '-'}</span>
            <span className="stat-label">Peso atual (kg)</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">
              {first.weight && last.weight ? (last.weight - first.weight).toFixed(1) : '-'}
            </span>
            <span className="stat-label">Variacao total (kg)</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{data.length}</span>
            <span className="stat-label">Registros</span>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Grafico de evolucao</h2>
        <EvolutionChart data={data} />
      </div>

      <div className="card">
        <h2>Historico</h2>
        {data.length === 0 && <p className="empty-state">Nenhum registro ainda.</p>}
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Data</th><th>Peso</th><th>% Gordura</th><th>Cintura</th></tr></thead>
            <tbody>
              {[...data].reverse().map((d, idx) => (
                <tr key={idx}>
                  <td>{new Date(d.record_date).toLocaleDateString('pt-BR')}</td>
                  <td>{d.weight ?? '-'}</td>
                  <td>{d.body_fat ?? '-'}</td>
                  <td>{d.waist_cm ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
