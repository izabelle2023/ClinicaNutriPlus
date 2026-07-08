import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  goal: string | null;
  height_cm: number | null;
  initial_weight: number | null;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [unclaimed, setUnclaimed] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [claimingId, setClaimingId] = useState<number | null>(null);

  async function load() {
    const [mineRes, unclaimedRes] = await Promise.all([
      api.get('/patients'),
      api.get('/patients/unclaimed')
    ]);
    setPatients(mineRes.data);
    setUnclaimed(unclaimedRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleClaim(id: number) {
    setClaimingId(id);
    try {
      await api.post(`/patients/${id}/claim`);
      await load();
    } finally {
      setClaimingId(null);
    }
  }

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loading">Carregando pacientes...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pacientes</h1>
        <input
          className="search-input"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {unclaimed.length > 0 && (
        <div className="card">
          <h2>Pacientes sem nutricionista vinculado</h2>
          <p className="muted">
            Estes pacientes se cadastraram no sistema mas ainda nao escolheram (ou nao
            tinham como escolher) um nutricionista. Vincule-os a voce para poder
            acompanha-los.
          </p>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Nome</th><th>E-mail</th><th></th></tr>
              </thead>
              <tbody>
                {unclaimed.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={claimingId === p.id}
                        onClick={() => handleClaim(p.id)}
                      >
                        {claimingId === p.id ? 'Vinculando...' : 'Vincular a mim'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && patients.length === 0 && (
        <p className="empty-state">
          Voce ainda nao tem pacientes vinculados. {unclaimed.length === 0 && 'Peca para o paciente se cadastrar, ou verifique a lista acima.'}
        </p>
      )}
      {filtered.length === 0 && patients.length > 0 && (
        <p className="empty-state">Nenhum paciente encontrado para essa busca.</p>
      )}

      {patients.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th><th>E-mail</th><th>Telefone</th><th>Objetivo</th><th>Altura</th><th>Peso inicial</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone || '-'}</td>
                  <td>{p.goal || '-'}</td>
                  <td>{p.height_cm ? `${p.height_cm} cm` : '-'}</td>
                  <td>{p.initial_weight ? `${p.initial_weight} kg` : '-'}</td>
                  <td><Link to={`/pacientes/${p.id}`} className="btn btn-sm btn-outline">Ver perfil</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}