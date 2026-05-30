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

    let cal = tmb * 1.55; 
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
// 3. DIÁRIO DE TREINO, PESO E GAMIFICAÇÃO
// ==========================================
let recordesPessoais = JSON.parse(localStorage.getItem('athlete_prs')) || {};
let historicoTreinos = JSON.parse(localStorage.getItem('athlete_historico')) || [];
let historicoPeso = JSON.parse(localStorage.getItem('athlete_historico_peso')) || [];
let xpTotal = parseInt(localStorage.getItem('athlete_xp')) || 0;
let diarioAlimentar = JSON.parse(localStorage.getItem('athlete_diario')) || [];
let chart;

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

// ==========================================
// 4. MÓDULO DIETA POR ORÇAMENTO (LISTA COMPLETA)
// ==========================================
function gerarDietaEconomica() {
    const orcamento = parseFloat(document.getElementById('orcamento').value);
    const resultadoDiv = document.getElementById('resultadoDieta');

    if (!orcamento || orcamento <= 0) return alert("Insira um orçamento válido.");

    // Banco de dados completo com base na sua lista detalhada
    const bancoDeAlimentos = [
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

    // Ordena pelo custo-benefício (preço por proteína)
    let listaOrdenada = bancoDeAlimentos.sort((a, b) => (a.preco / a.prot) - (b.preco / b.prot));
    
    let html = `<strong>Lista de Compras para R$ ${orcamento}:</strong><br><br>`;
    let gasto = 0;
    
    listaOrdenada.forEach(item => {
        if (gasto + item.preco <= orcamento) {
            html += `• ${item.nome} - R$ ${item.preco.toFixed(2)}<br>`;
            gasto += item.preco;
        }
    });

    html += `<br><strong>Total Gasto: R$ ${gasto.toFixed(2)}</strong>`;
    html += `<br><button onclick="copiarListaParaWhatsApp()" style="margin-top:10px; background:#25d366; color:white; border:none; padding:8px; cursor:pointer; border-radius:5px;">Copiar para WhatsApp</button>`;
    
    resultadoDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    
    // Armazena para o botão de copiar
    window.listaParaCopiar = html.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "").replace("Copiar para WhatsApp", "");
}

function copiarListaParaWhatsApp() {
    navigator.clipboard.writeText(window.listaParaCopiar);
    alert("Lista copiada! Cole no WhatsApp para enviar.");
}
// ==========================================
// 5. DIÁRIO ALIMENTAR
// ==========================================
function registrarRefeicao() {
    const alimento = document.getElementById('alimento').value;
    const calorias = parseInt(document.getElementById('caloriasConsumidas').value);

    if(!alimento || !calorias) return alert("Preencha o alimento e as calorias.");

    diarioAlimentar.push({ alimento, calorias });
    localStorage.setItem('athlete_diario', JSON.stringify(diarioAlimentar));
    
    document.getElementById('alimento').value = '';
    document.getElementById('caloriasConsumidas').value = '';
    renderizarDiario();
}

function renderizarDiario() {
    const lista = document.getElementById('listaRefeicoes');
    let total = 0;
    
    lista.innerHTML = diarioAlimentar.map(r => {
        total += r.calorias;
        return `<div>${r.alimento}: ${r.calorias} kcal</div>`;
    }).join('');
    
    document.getElementById('totalCalConsumido').innerText = total;
}

// ==========================================
// 6. UTILITÁRIOS E RENDERIZAÇÃO
// ==========================================
function registrarPeso() {
    const peso = document.getElementById('novoPeso').value;
    if (!peso) return alert("Insira o peso.");
    historicoPeso.unshift({ data: new Date().toLocaleDateString(), peso });
    localStorage.setItem('athlete_historico_peso', JSON.stringify(historicoPeso));
    
    desenharGrafico();
    document.getElementById('novoPeso').value = '';
}

function renderizarTabelaTreinos() {
    const tabela = document.getElementById('tabelaTreino');
    if (tabela) {
        tabela.innerHTML = historicoTreinos.map(t => 
            `<tr><td>${t.nome}</td><td>${t.carga}kg</td><td>${t.reps}x</td><td>${t.status}</td></tr>`
        ).join('');
    }
}

function atualizarGamificacao() {
    let nivel = Math.floor(xpTotal / 100) + 1;
    document.getElementById('nivelUsuario').innerText = nivel;
    document.getElementById('xpText').innerText = `XP Atual: ${xpTotal} / ${nivel * 100}`;
}

function exportarDados() {
    const dados = { historicoTreinos, historicoPeso, recordesPessoais };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'meu_evolucao_athlete.txt';
    a.click();
}

function desenharGrafico() {
    const ctx = document.getElementById('graficoPeso')?.getContext('2d');
    if (!ctx) return;
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicoPeso.map(h => h.data).reverse(),
            datasets: [{ label: 'Peso (kg)', data: historicoPeso.map(h => h.peso).reverse(), borderColor: '#3b82f6', tension: 0.3 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

window.onload = () => {
    renderizarTabelaTreinos();
    renderizarDiario();
    atualizarGamificacao();
    desenharGrafico();
};

function gerarCronograma() {
    const peso = parseFloat(document.getElementById('peso').value);
    const objetivo = document.getElementById('objetivo').value;
    const div = document.getElementById('resultadoCronograma');

    if (!peso) return alert("Por favor, insira seu peso na calculadora acima primeiro.");

    // Lógica de porcionamento baseada em objetivo
    const multiplicadorCarbo = (objetivo === 'bulking') ? 1.5 : 0.8;
    const proteina = Math.round(peso * 2); 
    const porcaoFrango = Math.round(proteina / 4); // Distribuição em 4 refeições
    const porcaoArroz = Math.round((peso * multiplicadorCarbo) / 2);

    const cronograma = `
        <strong>Seu Cronograma Personalizado (${objetivo.toUpperCase()}):</strong><br><br>
        • <strong>08:00 - Café:</strong> 3 Ovos + Aveia<br>
        • <strong>12:00 - Almoço:</strong> ${porcaoFrango}g Frango + ${porcaoArroz}g Arroz<br>
        • <strong>16:00 - Pré-Treino:</strong> Aveia + Fruta<br>
        • <strong>20:00 - Jantar:</strong> ${porcaoFrango}g Frango + Feijão<br><br>
        <small>Total de Proteína sugerido: ${proteina}g/dia</small>
    `;

    div.innerHTML = cronograma;
}

// ==========================================
// 7. CRONOGRAMA INTEGRADO AO ORÇAMENTO
// ==========================================
function gerarCronograma() {
    const orcamento = parseFloat(document.getElementById('orcamento').value);
    const div = document.getElementById('resultadoCronograma');

    if (!orcamento || orcamento <= 0) {
        return alert("Por favor, monte sua dieta por orçamento primeiro para calcular o cronograma.");
    }

    // Lógica inteligente: Distribui os alimentos comprados em 4 horários
    const cronograma = `
        <strong>Sugestão de Rotina Diária:</strong><br><br>
        • <strong>08:00 - Café:</strong> Ovos + Aveia/Banana<br>
        • <strong>12:00 - Almoço:</strong> Frango/Carne + Arroz + Feijão<br>
        • <strong>16:00 - Pré-Treino:</strong> Aveia + Amendoim/Banana<br>
        • <strong>20:00 - Jantar:</strong> Frango + Legumes (Brócolis/Batata)<br><br>
        <em>Nota: Ajuste as porções conforme sua meta calórica calculada no topo da página.</em>
    `;

    div.innerHTML = cronograma;
}
