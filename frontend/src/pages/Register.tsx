import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import api from '../services/api';

interface Nutritionist {
  id: number;
  name: string;
  email: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('paciente');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [nutritionistId, setNutritionistId] = useState('');
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'paciente') {
      api.get('/auth/nutritionists').then(({ data }) => setNutritionists(data)).catch(() => {});
    }
  }, [role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name, email, password, role,
        phone: phone || undefined,
        birthDate: birthDate || undefined,
        heightCm: heightCm ? Number(heightCm) : undefined,
        initialWeight: initialWeight ? Number(initialWeight) : undefined,
        goal: goal || undefined,
        nutritionistId: nutritionistId || undefined
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Nao foi possivel criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🥗 Criar conta</h1>
        <p className="subtitle">Clinica Nutri Plus</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Eu sou
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="paciente">Paciente</option>
            <option value="nutricionista">Nutricionista</option>
          </select>
        </label>

        <label>
          Nome completo
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>

        {role === 'paciente' && (
          <>
            <label>
              Nutricionista responsavel
              <select value={nutritionistId} onChange={(e) => setNutritionistId(e.target.value)}>
                <option value="">
                  {nutritionists.length === 0 ? 'Nenhum nutricionista cadastrado ainda' : 'Selecione (opcional)...'}
                </option>
                {nutritionists.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </label>
            {nutritionists.length === 0 && (
              <p className="muted" style={{ marginTop: -8, marginBottom: 14 }}>
                Se nenhum nutricionista aparecer, voce pode deixar em branco e vincular
                depois — a nutricionista consegue te vincular na area de Pacientes dela.
              </p>
            )}

            <label>
              Telefone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
            </label>
            <label>
              Data de nascimento
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </label>
            <div className="form-row">
              <label>
                Altura (cm)
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              </label>
              <label>
                Peso inicial (kg)
                <input type="number" step="0.1" value={initialWeight} onChange={(e) => setInitialWeight(e.target.value)} />
              </label>
            </div>
            <label>
              Objetivo
              <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Ex: Emagrecimento, ganho de massa..." />
            </label>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="auth-switch">
          Ja tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}