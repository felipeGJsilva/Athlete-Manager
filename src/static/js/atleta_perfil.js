document.addEventListener('DOMContentLoaded', () => {
    carregarPerfilAtleta();
    carregarEstatisticas();
    carregarAtividadesRecentes();
});

// CARREGAR PERFIL DO ATLETA
async function carregarPerfilAtleta() {
    try {
        // Buscar dados do atleta logado
        const response = await fetch('/api/atletas/me');
        if (!response.ok) {
            console.error('Erro ao carregar perfil');
            return;
        }
        const atleta = await response.json();

        // Preencher informações
        document.getElementById('avatar-inicial').textContent = atleta.nome.charAt(0).toUpperCase();
        document.getElementById('nome-atleta').textContent = atleta.nome;
        document.getElementById('esporte-posicao').textContent = `${atleta.esporte} - ${atleta.posicao || 'Atleta'}`;
        document.getElementById('idade').textContent = atleta.idade || '--';
        document.getElementById('altura').textContent = atleta.altura || '--';
        document.getElementById('peso').textContent = atleta.peso || '--';
        document.getElementById('email').textContent = atleta.email || '--';

    } catch (error) {
        console.error('Erro ao carregar perfil do atleta:', error);
    }
}

// CARREGAR ESTATÍSTICAS
async function carregarEstatisticas() {
    try {
        // Buscar resumo do atleta
        const response = await fetch('/api/atletas/me/resumo');
        if (!response.ok) return;
        const resumo = await response.json();

        document.getElementById('total-treinos').textContent = resumo.total_treinos || 0;
        document.getElementById('peso-atual').textContent = resumo.peso_atual || '--';
        document.getElementById('imc-atual').textContent = resumo.imc_atual || '--';

        // Próximo treino
        if (resumo.proximo_treino) {
            document.getElementById('proximo-treino').textContent = resumo.proximo_treino.tipo;
            document.getElementById('data-proximo-treino').textContent =
                new Date(resumo.proximo_treino.data_treino).toLocaleDateString();
        }

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// CARREGAR ATIVIDADES RECENTES
async function carregarAtividadesRecentes() {
    try {
        const timeline = document.getElementById('timeline-atividades');
        timeline.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';

        // Buscar treinos recentes
        const treinosResponse = await fetch('/api/treinos?limit=5');
        const treinos = await treinosResponse.json();

        // Buscar evoluções recentes
        const evolucoesResponse = await fetch('/api/evolucao?limit=5');
        const evolucoes = await evolucoesResponse.json();

        // Combinar e ordenar por data
        const atividades = [
            ...treinos.map(t => ({ ...t, tipo: 'treino', data: t.data_treino })),
            ...evolucoes.map(e => ({ ...e, tipo: 'evolucao', data: e.data_medicao }))
        ].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 10);

        timeline.innerHTML = atividades.map(atividade => `
            <div class="timeline-item">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">
                            ${atividade.tipo === 'treino' ? '🏋️ Treino Realizado' : '📊 Evolução Registrada'}
                        </h6>
                        <p class="mb-1 text-muted">
                            ${atividade.tipo === 'treino' ?
                                `${atividade.tipo} - ${atividade.duracao_minutos || 0} min` :
                                `Peso: ${atividade.peso} kg`}
                        </p>
                        <small class="text-muted">
                            ${new Date(atividade.data).toLocaleString()}
                        </small>
                    </div>
                    <span class="badge bg-${atividade.tipo === 'treino' ? 'primary' : 'success'}">
                        ${atividade.tipo === 'treino' ? 'Treino' : 'Evolução'}
                    </span>
                </div>
            </div>
        `).join('') || '<p class="text-center text-muted">Nenhuma atividade recente.</p>';

    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        document.getElementById('timeline-atividades').innerHTML =
            '<p class="text-center text-danger">Erro ao carregar atividades.</p>';
    }
}