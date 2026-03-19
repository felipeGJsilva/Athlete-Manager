console.log("✅ AthleteManager iniciado com sucesso");

/* ===============================
   ATUALIZAR CARDS DO DASHBOARD
================================ */

async function atualizarDashboard() {
    try {
        const [atletasRes, treinosRes, avaliacoesRes, competicoesRes, metasRes, evolucaoRes] = await Promise.all([
            fetch('/api/atletas'),
            fetch('/api/treinos'),
            fetch('/api/avaliacoes'),
            fetch('/api/competicoes'),
            fetch('/api/metas'),
            fetch('/api/evolucao')
        ]);

        const atletas = await atletasRes.json();
        const treinos = await treinosRes.json();
        const avaliacoes = await avaliacoesRes.json();
        const competicoes = await competicoesRes.json();
        const metas = await metasRes.json();
        const evolucao = await evolucaoRes.json();

        // Só atualiza se os elementos existirem
        if (document.getElementById("qtd-atletas")) {
            document.getElementById("qtd-atletas").innerText = atletas.length;
        }

        if (document.getElementById("qtd-treinos")) {
            document.getElementById("qtd-treinos").innerText = treinos.length;
        }

        if (document.getElementById("qtd-avaliacoes")) {
            document.getElementById("qtd-avaliacoes").innerText = avaliacoes.length;
        }

        if (document.getElementById("qtd-competicoes")) {
            document.getElementById("qtd-competicoes").innerText = competicoes.length;
        }

        if (document.getElementById("qtd-metas")) {
            document.getElementById("qtd-metas").innerText = metas.length;
        }

        if (document.getElementById("qtd-evolucao")) {
            document.getElementById("qtd-evolucao").innerText = evolucao.length;
        }
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

/* ===============================
   INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof atualizarDashboard === 'function') {
        atualizarDashboard();
    }
});

/* ===============================
   TEMA (NIGHT/DAY MODE)
================================ */
function toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light-mode');
}
