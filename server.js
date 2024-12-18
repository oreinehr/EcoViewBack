const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

// Criação do app Express
const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/sustainability', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((error) => {
  console.error('Erro ao conectar no MongoDB', error);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Definindo o esquema para armazenar as respostas do relatório de sustentabilidade
const sustainabilityAnswerSchema = new mongoose.Schema({
  Nome: String,
  VisãoGeral: String,
  EmissãoCarbono: String,
  ConsumoAgua: String,
  TiposGastos: String,
  wasteAmount: String,
  wasteDisposal: String,
  recycledMaterials: String,
  energyConsumption: String,
  objectives: String,
  certificates: String,
  branches: String,
  esgPractices: String,
  esgPracticesDescription: String,
});

// Criando o modelo para as respostas
const SustainabilityAnswer = mongoose.model('SustainabilityAnswer', sustainabilityAnswerSchema);

// Rota para salvar as respostas do formulário
app.post('/api/sustainability-report', [
  check('companyName').isString().notEmpty().withMessage('O nome da empresa é obrigatório'),
  check('companyOverview').isString().notEmpty().withMessage('A visão geral da empresa é obrigatória'),
  check('carbonEmissions').isString().notEmpty().withMessage('As emissões de carbono são obrigatórias'),
  check('waterConsumption').isString().notEmpty().withMessage('O consumo de água é obrigatório'),
  check('wasteTypes').isString().notEmpty().withMessage('Os tipos de resíduos são obrigatórios'),
  check('wasteAmount').isString().notEmpty().withMessage('A quantidade de resíduos é obrigatória'),
  check('wasteDisposal').isString().notEmpty().withMessage('O descarte e destinação dos resíduos são obrigatórios'),
  check('recycledMaterials').isString().notEmpty().withMessage('A quantidade de materiais reciclados é obrigatória'),
  check('energyConsumption').isString().notEmpty().withMessage('O consumo de energia é obrigatório'),
  check('objectives').isString().notEmpty().withMessage('Os objetivos e metas são obrigatórios'),
  check('branches').isString().notEmpty().withMessage('As filiais da empresa são obrigatórias'),
  check('esgPractices').isString().notEmpty().withMessage('As práticas ESG são obrigatórias'),
], async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    companyName,
    companyOverview,
    carbonEmissions,
    waterConsumption,
    wasteTypes,
    wasteAmount,
    wasteDisposal,
    recycledMaterials,
    energyConsumption,
    objectives,
    certificates,
    branches,
    esgPractices,
    esgPracticesDescription,
  } = req.body;

  try {
    const answers = new SustainabilityAnswer({
      companyName,
      companyOverview,
      carbonEmissions,
      waterConsumption,
      wasteTypes,
      wasteAmount,
      wasteDisposal,
      recycledMaterials,
      energyConsumption,
      objectives,
      certificates,
      branches,
      esgPractices,
      esgPracticesDescription,
    });

    await answers.save();
    res.status(201).json({ message: 'Respostas do relatório salvas com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar respostas do relatório', error });
  }
});

// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
qs