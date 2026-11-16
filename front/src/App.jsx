import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, PlusCircle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/transactions/';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'IN', // Ajuste para 'INCOME'/'EXPENSE' se o seu model usar outro choice
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        title: '',
        amount: '',
        type: 'IN',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const totalEntradas = transactions
    .filter((t) => t.type === 'IN' || t.type === 'INCOME' || t.type === 'entrada')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalSaidas = transactions
    .filter((t) => t.type === 'OUT' || t.type === 'EXPENSE' || t.type === 'saida')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const saldo = totalEntradas - totalSaidas;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Financeiro</h1>

      {/* Cards de Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#e6f4ea', color: '#137333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Entradas</span>
            <ArrowUpCircle size={20} />
          </div>
          <h2>R$ {totalEntradas.toFixed(2)}</h2>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#fce8e6', color: '#c5221f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Saídas</span>
            <ArrowDownCircle size={20} />
          </div>
          <h2>R$ {totalSaidas.toFixed(2)}</h2>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#e8f0fe', color: '#1967d2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Saldo Atual</span>
            <DollarSign size={20} />
          </div>
          <h2>R$ {saldo.toFixed(2)}</h2>
        </div>
      </div>

      {/* Formulário de Nova Transação */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Título"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="IN">Entrada</option>
          <option value="OUT">Saída</option>
        </select>
        <input
          type="text"
          placeholder="Categoria"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <PlusCircle size={18} /> Adicionar
        </button>
      </form>

      {/* Tabela de Transações */}
      <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f3f4' }}>
            <th>Título</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
              <td>{t.date}</td>
              <td>R$ {Number(t.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}