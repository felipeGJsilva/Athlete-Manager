document.addEventListener('DOMContentLoaded', () => {
    carregarAtletas();
    carregarAvaliacoes();
});

// CARREGAR ATLETAS
async function carregarAtletas() {
    try {
        const response = await fetch('/api/atletas');
        const atletas = await response.json();
        const select = document.querySelector('select[name="atleta_id"]');
        select.innerHTML = '<option value="">Selecione o atleta</option>' +
            atletas.map(a => `<option value="${a.id}">${a.nome} - ${a.esporte}</option>`).join('');
    } catch (error) {
        console.error('Erro ao carregar atletas:', error);
    }
}

// SALVAR AVALIAÇÃO
document.getElementById("formAvaliacao").onsubmit = async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
        atleta_id: parseInt(form.atleta_id.value),
        forca: form.forca.value ? parseFloat(form.forca.value) : null,
        resistencia: form.resistencia.value ? parseFloat(form.resistencia.value) : null,
        velocidade: form.velocidade.value ? parseFloat(form.velocidade.value) : null,
        flexibilidade: form.flexibilidade.value ? parseFloat(form.flexibilidade.value) : null,
        imc: form.imc.value ? parseFloat(form.imc.value) : null,
        data_avaliacao: form.data_avaliacao.value || null,
        observacoes: form.observacoes.value
    };

    try {
        const response = await fetch('/api/avaliacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            form.reset();
            carregarAvaliacoes();
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
    }
};

// CARREGAR AVALIAÇÕES
async function carregarAvaliacoes() {
    try {
        const response = await fetch('/api/avaliacoes');
        const avaliacoes = await response.json();
        const tbody = document.getElementById('listaAvaliacoes');
        tbody.innerHTML = avaliacoes.map(a => `
            <tr>
                <td>${a.atleta_nome || 'N/A'}</td>
                <td>${new Date(a.data_avaliacao).toLocaleDateString()}</td>
                <td>${a.forca || '-'}</td>
                <td>${a.resistencia || '-'}</td>
                <td>${a.velocidade || '-'}</td>
                <td>${a.flexibilidade || '-'}</td>
                <td>${a.imc || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="excluirAvaliacao(${a.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

// EXCLUIR AVALIAÇÃO
async function excluirAvaliacao(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        const response = await fetch(`/api/avaliacoes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarAvaliacoes();
        }
    } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
    }
}
