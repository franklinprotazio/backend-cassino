const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// Conexão com o banco de dados do Easypanel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// ROTA: Cadastrar novo cliente (Tenant)
app.post('/cadastrar-cliente', async (req, res) => {
  const { brand_name, package_level, base_player_limit } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tenants (brand_name, package_level, base_player_limit) VALUES ($1, $2, $3) RETURNING *',
      [brand_name, package_level, base_player_limit]
    );
    res.json({ mensagem: "Cliente criado com sucesso!", cliente: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ROTA: Adicionar Espaço Extra (O que você pediu)
app.post('/comprar-espaco', async (req, res) => {
  const { tenant_id, slots_adicionais } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tenants SET extra_player_slots = extra_player_slots + $1 WHERE id = $2 RETURNING *',
      [slots_adicionais, tenant_id]
    );
    res.json({ mensagem: "Espaço adicionado!", dados_atualizados: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));