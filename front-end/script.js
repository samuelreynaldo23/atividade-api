const API = "http://localhost:3000/api/carros";

const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const breedInput = document.getElementById("breedInput");
const message = document.getElementById("message");
const carImage = document.getElementById("carImage");
const breedName = document.getElementById("breedName");

// Esconde a foto e mostra a mensagem de erro em vermelho
function showError(text) {
  carImage.hidden = true;
  breedName.textContent = "";
  message.textContent = text;
  message.className = "error";
}

// Mostra a foto e o nome do carro embaixo
function showCar(data) {
  message.textContent = "";
  carImage.src = data.imagem;
  carImage.hidden = false;
  breedName.textContent = data.categoria;
}

// Chama a API e trata os dois erros: servidor offline e carro não encontrado (404)
async function fetchCar(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      showError(`🚧 ${data.erro} Tente: ${data.disponiveis.join(", ")}.`);
      return;
    }
    showCar(data);
  } catch (e) {
    showError("🔌 Servidor offline. Rode 'node server.js' e tente de novo.");
  }
}

randomBtn.addEventListener("click", () => fetchCar(`${API}/aleatorio`));

searchBtn.addEventListener("click", () => {
  const name = breedInput.value.trim();
  if (!name) return showError("Digite o nome de um carro para buscar.");
  fetchCar(`${API}/${encodeURIComponent(name)}`);
});

breedInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});