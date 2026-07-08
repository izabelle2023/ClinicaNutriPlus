import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span role="img" aria-label="salada">🥗</span> Clinica Nutri Plus
      </div>
      <nav className="navbar-links">
        {user.role === 'nutricionista' ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/pacientes">Pacientes</Link>
            <Link to="/consultas">Consultas</Link>
          </>
        ) : (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/consultas">Minhas Consultas</Link>
            <Link to="/plano-alimentar">Plano Alimentar</Link>
            <Link to="/evolucao">Minha Evolucao</Link>
          </>
        )}
      </nav>
      <div className="navbar-user">
        <span>{user.name} · {user.role === 'nutricionista' ? 'Nutricionista' : 'Paciente'}</span>
        <button onClick={handleLogout} className="btn btn-outline">Sair</button>
      </div>
    </header>
  );
}
