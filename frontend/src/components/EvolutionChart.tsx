import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export interface EvolutionPoint {
  record_date: string;
  weight: number | null;
  body_fat: number | null;
  waist_cm: number | null;
}

export default function EvolutionChart({ data }: { data: EvolutionPoint[] }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">Ainda nao ha registros de evolucao para exibir no grafico.</p>;
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="record_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#2f9e5b" strokeWidth={2} />
          <Line type="monotone" dataKey="body_fat" name="% Gordura" stroke="#e8a33d" strokeWidth={2} />
          <Line type="monotone" dataKey="waist_cm" name="Cintura (cm)" stroke="#3d7ee8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
