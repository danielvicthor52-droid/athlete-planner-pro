// ==========================================
// BANCO DE DADOS COMPLETO
// ==========================================
const BANCO_ALIMENTOS = [
    { nome: "Ovo de galinha (30 un)", preco: 20, prot: 180 },
    { nome: "Peito de frango (1kg)", preco: 19, prot: 310 },
    { nome: "Carne moída (1kg)", preco: 33, prot: 260 },
    { nome: "Filé de Tilápia (1kg)", preco: 40, prot: 260 },
    { nome: "Coxa/Sobrecoxa (1kg)", preco: 12, prot: 250 },
    { nome: "Sardinha (1kg)", preco: 15, prot: 200 },
    { nome: "Leite integral (1L)", preco: 5, prot: 30 },
    { nome: "Iogurte natural (170g)", preco: 4, prot: 10 },
    { nome: "Arroz branco (1kg)", preco: 6.5, prot: 20 },
    { nome: "Aveia (500g)", preco: 7.5, prot: 65 },
    { nome: "Pão de forma (500g)", preco: 7.5, prot: 40 },
    { nome: "Batata doce (1kg)", preco: 5.5, prot: 15 },
    { nome: "Mandioca (1kg)", preco: 6.5, prot: 10 },
    { nome: "Macarrão (500g)", preco: 5.5, prot: 60 },
    { nome: "Feijão (1kg)", preco: 8.5, prot: 190 },
    { nome: "Grão-de-bico (500g)", preco: 10, prot: 95 },
    { nome: "Amendoim (500g)", preco: 8.5, prot: 130 },
    { nome: "Pasta de amendoim (500g)", preco: 18, prot: 120 },
    { nome: "Banana (1kg)", preco: 6, prot: 10 },
    { nome: "Maçã (1kg)", preco: 9, prot: 3 },
    { nome: "Brócolis (Maço)", preco: 6.5, prot: 15 }
];

// ==========================================
// MÓDULOS DE CÁLCULO E DIETA
// ==========================================

function gerarDietaEconomica() {
    const orcamento = parseFloat(document.getElementById('orcamento').value);
    const resultadoDiv = document.getElementById('resultadoDieta');

    if (!orcamento || orcamento <= 0) return alert("Insira um orçamento válido.");

    let listaOrdenada = [...BANCO_ALIMENTOS].sort((a, b) => (a.preco / a.prot) - (b.preco / b.prot));
    
    let html = `<strong>Lista de Compras (Orçamento R$ ${orcamento}):</strong><br><br>`;
    let gasto = 0;
    let listaSelecionada = [];
    
    listaOrdenada.forEach(item => {
        if (gasto + item.preco <= orcamento) {
            html += `• ${item.nome} - R$ ${item.preco.toFixed(2)}<br>`;
            gasto += item.preco;
            listaSelecionada.push(item.nome);
        }
    });

    html += `<br><strong>Total Gasto: R$ ${gasto.toFixed(2)}</strong>`;
    html += `<br><button onclick="copiarListaParaWhatsApp()" style="margin-top:10px; background:#25d366; color:white; border:none; padding:8px; cursor:pointer; border-radius:5px;">Copiar Lista</button>`;
    
    resultadoDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    
    window.dietaAtual = listaSelecionada; // Armazena itens comprados
    window.listaParaCopiar = html.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "").replace("Copiar Lista", "");
}

function gerarCronograma() {
    const div = document.getElementById('resultadoCronograma');
    
    if (!window.dietaAtual || window.dietaAtual.length === 0) {
        return alert("Primeiro gere sua lista de compras no módulo de Orçamento!");
    }

    // Identifica itens comprados
    const temOvo = window.dietaAtual.some(i => i.includes("Ovo"));
    const temFrango = window.dietaAtual.some(i => i.includes("frango"));
    const temCarne = window.dietaAtual.some(i => i.includes("Carne"));
    const temArroz = window.dietaAtual.some(i => i.includes("Arroz"));
    const temAveia = window.dietaAtual.some(i => i.includes("Aveia"));
    const temBatata = window.dietaAtual.some(i => i.includes("Batata"));

    div.innerHTML = `
        <strong>Sua Rotina com base no que você comprou:</strong><br><br>
        • <strong>08:00 - Café:</strong> ${temOvo ? "Ovos" : "Proteína"} + ${temAveia ? "Aveia" : "Carboidrato"}<br>
        • <strong>12:00 - Almoço:</strong> ${temFrango || temCarne ? "Frango/Carne" : "Proteína"} + ${temArroz ? "Arroz" : "Carboidrato"}<br>
        • <strong>16:00 - Pré-treino:</strong> ${temAveia ? "Aveia" : "Carboidrato"} + Fruta<br>
        • <strong>20:00 - Jantar:</strong> ${temFrango || temCarne ? "Proteína" : "Proteína"} + ${temBatata ? "Batata" : "Legumes"}<br>
    `;
    div.style.display = 'block';
}

function copiarListaParaWhatsApp() {
    navigator.clipboard.writeText(window.listaParaCopiar);
    alert("Lista copiada! Cole no WhatsApp.");
}

// ==========================================
// MÓDULOS DE TREINO E PESO (MANTIDOS)
// ==========================================

function calcularMacros() { /* Lógica mantida */ }
function registrarRefeicao() { /* Lógica mantida */ }
function renderizarDiario() { /* Lógica mantida */ }
function registrarTreino() { /* Lógica mantida */ }
function renderizarTabelaTreinos() { /* Lógica mantida */ }
function registrarPeso() { /* Lógica mantida */ }
function atualizarGamificacao() { /* Lógica mantida */ }
function desenharGrafico() { /* Lógica mantida */ }

window.onload = () => {
    renderizarTabelaTreinos();
    renderizarDiario();
    atualizarGamificacao();
    desenharGrafico();
};
