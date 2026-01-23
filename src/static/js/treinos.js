document.addEventListener('DOMContentLoaded', () => {
    carregarTreinos();
    carregarAtletas();
});

// CARREGAR ATLETAS PARA OS SELECTS
async function carregarAtletas() {
    try {
        const response = await fetch('/api/atletas');
        const atletas = await response.json();
        const selects = document.querySelectorAll('select[name="atleta_id"]');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Selecione um atleta</option>' +
                atletas.map(a => `<option value="${a.id}">${a.nome} - ${a.esporte}</option>`).join('');
        });
    } catch (error) {
        console.error('Erro ao carregar atletas:', error);
    }
}

// FUNÇÃO ADICIONAR
document.getElementById("formAddTreino").onsubmit = async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
        atleta_id: parseInt(form.atleta_id.value),
        tipo: form.tipo.value,
        descricao: form.descricao.value,
        duracao_minutos: form.duracao_minutos.value ? parseInt(form.duracao_minutos.value) : null,
        data_treino: form.data_treino.value || null,
        intensidade: form.intensidade.value
    };

    try {
        const response = await fetch('/api/treinos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            form.reset();
            carregarTreinos();
            bootstrap.Modal.getInstance(document.getElementById("modalAddTreino")).hide();
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao adicionar treino:', error);
    }
};

// FUNÇÃO EDITAR
document.getElementById("formEditTreino").onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const data = {
        atleta_id: parseInt(form.atleta_id.value),
        tipo: form.tipo.value,
        descricao: form.descricao.value,
        duracao_minutos: form.duracao_minutos.value ? parseInt(form.duracao_minutos.value) : null,
        data_treino: form.data_treino.value || null,
        intensidade: form.intensidade.value
    };

    try {
        const response = await fetch(`/api/treinos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            carregarTreinos();
            bootstrap.Modal.getInstance(document.getElementById("modalEditTreino")).hide();
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao editar treino:', error);
    }
};

// CARREGAR TREINOS
async function carregarTreinos() {
    try {
        const response = await fetch('/api/treinos');
        const treinos = await response.json();
        const lista = document.getElementById("lista-treinos");
        lista.innerHTML = treinos.map(t => `
            <div class="dash-card">
                <div class="atleta-info">
                    <h4>${t.tipo} - ${t.atleta_nome}</h4>
                    <p>${t.descricao || 'Sem descrição'}</p>
                    <small>Duração: ${t.duracao_minutos || 'N/A'} min | Intensidade: ${t.intensidade || 'N/A'} | Data: ${new Date(t.data_treino).toLocaleString()}</small>
                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-sm btn-primary" onclick='editarTreino(${t.id})'>Editar</button>
                        <button class="btn btn-sm btn-danger" onclick='excluirTreino(${t.id})'>Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar treinos:', error);
    }
}

// EDITAR TREINO
async function editarTreino(id) {
    try {
        const response = await fetch(`/api/treinos/${id}`);
        const t = await response.json();
        const form = document.getElementById("formEditTreino");

        form.id.value = t.id;
        form.atleta_id.value = t.atleta_id;
        form.tipo.value = t.tipo;
        form.descricao.value = t.descricao || '';
        form.duracao_minutos.value = t.duracao_minutos || '';
        form.data_treino.value = t.data_treino ? new Date(t.data_treino).toISOString().slice(0, 16) : '';
        form.intensidade.value = t.intensidade || '';

        new bootstrap.Modal(document.getElementById("modalEditTreino")).show();
    } catch (error) {
        console.error('Erro ao carregar treino para edição:', error);
    }
}

// EXCLUIR TREINO
async function excluirTreino(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        const response = await fetch(`/api/treinos/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarTreinos();
        }
    } catch (error) {
        console.error('Erro ao excluir treino:', error);
    }
}
