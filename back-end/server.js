const express = require("express");
const cors = require("cors");
const path = require("path");
const carros = require("./data/fotos/cars.json");

const app = express();
const PORT = 3000;

// Permite que o front-end (aberto direto do arquivo) chame esta API
app.use(cors());

// Deixa as fotos acessíveis em http://localhost:3000/fotos/...
app.use("/fotos", express.static(path.join(__dirname, "data", "fotos")));

// Deixa o texto minúsculo, sem acentos e sem espaços nas pontas
// para "  Mustang " virar "mustang", que é a chave do JSON
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Escolhe um item qualquer de uma lista
function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Monta o JSON de resposta com o nome do carro e a URL completa da foto
function montarResposta(req, chave) {
  const carro = carros[chave];
  const foto = sortear(carro.fotos);
  return {
    categoria: carro.nome,
    imagem: `${req.protocol}://${req.get("host")}${foto}`,
  };
}

// Rota 1: foto aleatória de qualquer carro
// (fica ANTES da rota :categoria, senão "aleatorio" seria lido como categoria)
app.get("/api/carros/aleatorio", (req, res) => {
  const chave = sortear(Object.keys(carros));
  res.json(montarResposta(req, chave));
});

// Rota 2: foto aleatória de um carro específico
app.get("/api/carros/:categoria", (req, res) => {
  const chave = normalizar(req.params.categoria);

  if (!carros[chave]) {
    return res.status(404).json({
      erro: `Carro "${req.params.categoria}" não encontrado.`,
      disponiveis: Object.values(carros).map((c) => c.nome),
    });
  }

  res.json(montarResposta(req, chave));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});