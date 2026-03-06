import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// store measurements per month
const STORAGE_KEY_EVOL = 'evolucoesData';

function Evolucoes() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dataSet, setDataSet] = useState({});
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState({ month: '', peso: '', gordura: '', massa_muscular: '', altura: '' });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_EVOL);
    if (stored) setMeasurements(JSON.parse(stored));
  }, []);

  useEffect(() => {
    buildChart();
  }, [measurements, year]);

  const saveStorage = (list) => {
    localStorage.setItem(STORAGE_KEY_EVOL, JSON.stringify(list));
  };

  const addMeasurement = (e) => {
    e.preventDefault();
    const entry = {
      year,
      month: parseInt(form.month,10),
      peso: parseFloat(form.peso) || 0,
      gordura: parseFloat(form.gordura) || 0,
      massa_muscular: parseFloat(form.massa_muscular) || 0,
      altura: parseFloat(form.altura) || 0
    };
    const updated = [...measurements, entry];
    setMeasurements(updated);
    saveStorage(updated);
    setForm({ month: '', peso: '', gordura: '', massa_muscular: '', altura: '' });
  };

  const buildChart = () => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const filtered = measurements.filter(m => m.year === parseInt(year,10));
    const byMonth = Array(12).fill({peso:null,gordura:null,muscular:null,altura:null}).map((_,i) => filtered.find(m=>m.month===i+1) || {});
    setDataSet({
      labels: months,
      datasets: [
        { label:'Peso', data: byMonth.map(m=>m.peso || null), borderColor:'gold', tension:0.2 },
        { label:'Gordura %', data: byMonth.map(m=>m.gordura || null), borderColor:'red', tension:0.2 },
        { label:'Massa Muscular', data: byMonth.map(m=>m.massa_muscular || null), borderColor:'green', tension:0.2 }
      ]
    });
  };

  return (
    <div className="container py-4">
      <h1 className="text-warning mb-4">Evoluções Corporais</h1>
      <div className="mb-3">
        <label>Ano:&nbsp;</label>
        <input type="number" value={year} onChange={e=>setYear(e.target.value)} style={{width:'100px'}} />
      </div>

      <form onSubmit={addMeasurement} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <select name="month" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} className="form-control">
              <option value="">Mês</option>
              {[...Array(12)].map((_,i)=><option key={i} value={i+1}>{i+1}</option>)}
            </select>
          </div>
          <div className="col-md-2"><input name="peso" placeholder="Peso" value={form.peso} onChange={e=>setForm({...form,peso:e.target.value})} className="form-control"/></div>
          <div className="col-md-2"><input name="gordura" placeholder="Gordura %" value={form.gordura} onChange={e=>setForm({...form,gordura:e.target.value})} className="form-control"/></div>
          <div className="col-md-2"><input name="massa_muscular" placeholder="Massa Muscular" value={form.massa_muscular} onChange={e=>setForm({...form,massa_muscular:e.target.value})} className="form-control"/></div>
          <div className="col-md-2"><input name="altura" placeholder="Altura" value={form.altura} onChange={e=>setForm({...form,altura:e.target.value})} className="form-control"/></div>
          <div className="col-md-2"><button className="btn btn-warning">Adicionar</button></div>
        </div>
      </form>

      <div className="chart-container" style={{height:'400px'}}>
        <Line data={dataSet} />
      </div>
    </div>
  );
}

export default Evolucoes;
