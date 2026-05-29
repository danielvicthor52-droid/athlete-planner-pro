// ==========================================
// 1. CÁLCULO DE MACROS E TMB
// ==========================================
function calcularMacros() {
    const objetivo = document.getElementById('objetivo').value;
    const sexo = document.getElementById('sexo').value;
    const idade = parseFloat(document.getElementById('idade').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);

    if(!idade || !peso || !altura) {
        alert("Preencha todos os campos da calculadora.");
        return;
    }

    let tmb = (sexo === 'homem') 
        ? (10 * peso) + (6.25 * altura) - (5 * idade) + 5 
        : (10 * peso) + (6.25 * altura) - (5 * idade) - 161;

    let cal = tmb * 1.55; // Multiplicador padrão
    if (objetivo === 'cutting') cal -= 500;
    if (objetivo === 'bulking') cal += 300;

    document.getElementById('resCalorias').innerText = Math.round(cal);
    document.getElementById('resProt').innerText = Math.round(peso * 2) + "g";
    document.getElementById('resGord').innerText = Math.round(peso * 1) + "g";
    document.getElementById('resCarb').innerText = Math.round((cal - ((peso*2)*4 + (peso*1)*9)) / 4) + "g";
    document.getElementById('resultados').style.display = 'block';
}

// ==========================================
// 2. MÓDULO IA E BF%
// ==========================================
function calcularBFReal() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const cintura = parseFloat(document.getElementById('medidaCintura').value);
    const pescoco = parseFloat(document.getElementById('medidaPescoco').value);
    
    if(!peso || !altura || !cintura || !pescoco) {
        alert("Preencha peso, altura, cintura e pescoço.");
        return;
    }

    const bf = 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) - 450;
    
    document.getElementById('resultadoBF').innerText = bf.toFixed(1) + "%";
    document.getElementById('massaMagra').innerText = (peso - (peso * (bf / 100))).toFixed(1);
    document.getElementById('resultadoIA').style.display = 'block';
}

// ==========================================
// 3. DIÁRIO DE TREINO E PESO
// ==========================================
let recordesPessoais = JSON.parse(localStorage.getItem('athlete_prs')) || {};
let historicoTreinos = JSON.parse(localStorage.getItem('athlete_historico')) || [];
let historicoPeso = JSON.parse(localStorage.getItem('athlete_historico_peso')) || [];
let xpTotal = parseInt(localStorage.getItem('athlete_xp')) || 0;

function registrarTreino() {
    const nome = document.getElementById('nomeExercicio').value.toUpperCase();
    const carga = document.getElementById('cargaExercicio').value;
    const reps = document.getElementById('repsExercicio').value;

    if(!nome || !carga || !reps) return alert("Preencha o treino.");

    let status = "Série Normal";
    if (!recordesPessoais[nome] || carga > recordesPessoais[nome]) {
        recordesPessoais[nome] = carga;
        status = "🏆 NOVO PR!";
        xpTotal += 40;
    } else {
        xpTotal += 10;
    }

    historicoTreinos.unshift({ nome, carga, reps, status });
    localStorage.setItem('athlete_prs', JSON.stringify(recordesPessoais));
    localStorage.setItem('athlete_historico', JSON.stringify(historicoTreinos));
    localStorage.setItem('athlete_xp', xpTotal);
    
    renderizarTabelaTreinos();
    atualizarGamificacao();
}

function registrarPeso() {
    const peso = document.getElementById('novoPeso').value;
    if (!peso) return alert("Insira o peso.");
    historicoPeso.unshift({ data: new Date().toLocaleDateString(), peso });
    localStorage.setItem('athlete_historico_peso', JSON.stringify(historicoPeso));
    renderizarHistoricoPeso();
}

function renderizarTabelaTreinos() {
    const tabela = document.getElementById('tabelaTreino');
    tabela.innerHTML = historicoTreinos.map(t => 
        `<tr><td>${t.nome}</td><td>${t.carga}kg</td><td>${t.reps}x</td><td>${t.status}</td></tr>`
    ).join('');
}

function renderizarHistoricoPeso() {
    document.getElementById('historicoPeso').innerHTML = historicoPeso.map(h => 
        `<div>${h.data}: <strong>${h.peso} kg</strong></div>`
    ).join('');
}

function atualizarGamificacao() {
    let nivel = Math.floor(xpTotal / 100) + 1;
    document.getElementById('nivelUsuario').innerText = nivel;
    document.getElementById('xpText').innerText = `XP Atual: ${xpTotal} / ${nivel * 100}`;
}

window.onload = () => {
    renderizarTabelaTreinos();
    renderizarHistoricoPeso();
    atualizarGamificacao();
};

function exportarDados() {
    const dados = {
        historicoTreinos: JSON.parse(localStorage.getItem('athlete_historico')),
        historicoPeso: JSON.parse(localStorage.getItem('athlete_historico_peso')),
        recordes: JSON.parse(localStorage.getItem('athlete_prs'))
    };

    const texto = JSON.stringify(dados, null, 2);
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu_evolucao_athlete.txt';
    a.click();
}

let chart; // Variável global do gráfico

function desenharGrafico() {
    const ctx = document.getElementById('graficoPeso').getContext('2d');
    
    // Se o gráfico já existir, destrua-o para desenhar o novo
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicoPeso.map(h => h.data),
            datasets: [{
                label: 'Peso (kg)',
                data: historicoPeso.map(h => h.peso),
                borderColor: '#3b82f6',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Atualize sua função registrarPeso para chamar o gráfico
function registrarPeso() {
    const peso = document.getElementById('novoPeso').value;
    if (!peso) return alert("Insira o peso.");
    historicoPeso.unshift({ data: new Date().toLocaleDateString(), peso });
    localStorage.setItem('athlete_historico_peso', JSON.stringify(historicoPeso));
    
    desenharGrafico(); // <--- Adicione esta chamada
    document.getElementById('novoPeso').value = '';
}

// Adicione desenharGrafico() ao seu window.onload
window.onload = () => {
    renderizarTabelaTreinos();
    atualizarGamificacao();
    desenharGrafico(); // <--- Adicione esta chamada
};

// Base de dados de alimentos (pode ser expandida)
const bancoDeAlimentos = [
    { nome: "Ovos (dúzia)", preco: 12, prot: 72 },
    { nome: "Peito de Frango (kg)", preco: 22, prot: 310 },
    { nome: "Arroz (kg)", preco: 6, prot: 20 },
    { nome: "Feijão (kg)", preco: 8, prot: 190 },
    { nome: "Aveia (kg)", preco: 10, prot: 130 }
];

function gerarDietaEconomica() {
    const orcamento = parseFloat(document.getElementById('orcamento').value);
    if (!orcamento) return alert("Insira um orçamento semanal.");

    // Lógica simples de IA: Prioriza custo-benefício de proteína
    let listaCompras = bancoDeAlimentos.sort((a, b) => (a.preco/a.prot) - (b.preco/b.prot));
    
    let html = "<strong>Lista de Compras Otimizada:</strong><br>";
    let gasto = 0;
    
    listaCompras.forEach(item => {
        if (gasto + item.preco <= orcamento) {
            html += `• ${item.nome} (R$ ${item.preco})<br>`;
            gasto += item.preco;
        }
    });

    html += `<br><strong>Total Gasto: R$ ${gasto}</strong>`;
    document.getElementById('resultadoDieta').innerHTML = html;
    document.getElementById('resultadoDieta').style.display = 'block';
}
