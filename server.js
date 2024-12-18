const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Importando o axios para fazer requisições HTTP

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

// Endpoint para receber os dados do formulário e armazená-los no banco de dados
app.post('/api/gemini', async (req, res) => {
  try {
    const reportData = req.body.reportData;

    // Lógica para processar o relatório usando a API Gemini
    const response = await axios.post('https://api.gemini.com/process', {
      data: reportData,
      // Outros parâmetros necessários para a API do Gemini
    });

    const generatedText = response.data.text; // Supondo que o texto gerado venha em 'text'

    // Dividir os dados do formulário em partes
    const dataFields = reportData.split("\n").map(item => item.split(":"));
    const report = {};

    // Preencher o objeto report com as partes
    dataFields.forEach(field => {
      const [key, value] = field;
      report[key.trim()] = value.trim();
    });

    // Adiciona o texto gerado ao relatório
    report.generatedText = generatedText;

    // Salvar os dados no banco de dados
    const newReport = new SustainabilityAnswer(report);
    await newReport.save();

    res.status(200).send({ message: 'Relatório salvo com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao processar o relatório.' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
