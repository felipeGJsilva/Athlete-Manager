document.addEventListener('DOMContentLoaded', () => {
    carregarAtletas();
    carregarEvolucao();
});

// CARREGAR ATLETAS
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
document.getElementById("formAddEvolucao").onsubmit = async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
        atleta_id: parseInt(form.atleta_id.value),
        peso: parseFloat(form.peso.value),
        altura: form.altura.value ? parseFloat(form.altura.value) : null,
        imc: form.imc.value ? parseFloat(form.imc.value) : null,
        massa_muscular: form.massa_muscular.value ? parseFloat(form.massa_muscular.value) : null,
        gordura_corporal: form.gordura_corporal.value ? parseFloat(form.gordura_corporal.value) : null,
        data_medicao: form.data_medicao.value || null,
        observacoes: form.observacoes.value
    };

    try {
        const response = await fetch('/api/evolucao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            form.reset();
            carregarEvolucao();
            bootstrap.Modal.getInstance(document.getElementById("modalAddEvolucao")).hide();
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao adicionar evolução:', error);
    }
};

// FUNÇÃO EDITAR
document.getElementById("formEditEvolucao").onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const data = {
        atleta_id: parseInt(form.atleta_id.value),
        peso: parseFloat(form.peso.value),
        altura: form.altura.value ? parseFloat(form.altura.value) : null,
        imc: form.imc.value ? parseFloat(form.imc.value) : null,
        massa_muscular: form.massa_muscular.value ? parseFloat(form.massa_muscular.value) : null,
        gordura_corporal: form.gordura_corporal.value ? parseFloat(form.gordura_corporal.value) : null,
        data_medicao: form.data_medicao.value || null,
        observacoes: form.observacoes.value
    };

    try {
        const response = await fetch(`/api/evolucao/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            carregarEvolucao();
            bootstrap.Modal.getInstance(document.getElementById("modalEditEvolucao")).hide();
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao editar evolução:', error);
    }
};

// CARREGAR EVOLUÇÃO
async function carregarEvolucao() {
    try {
        const response = await fetch('/api/evolucao');
        const evolucoes = await response.json();
        const lista = document.getElementById("lista-evolucao");
        lista.innerHTML = evolucoes.map(e => `
            <div class="dash-card">
                <div class="atleta-info">
                    <h4>${e.atleta_nome} - ${e.peso} kg</h4>
                    <p>Altura: ${e.altura || 'N/A'} m | IMC: ${e.imc || 'N/A'} | Massa Muscular: ${e.massa_muscular || 'N/A'}% | Gordura: ${e.gordura_corporal || 'N/A'}%</p>
                    <small>Data: ${new Date(e.data_medicao).toLocaleString()}</small>
                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-sm btn-primary" onclick='editarEvolucao(${e.id})'>Editar</button>
                        <button class="btn btn-sm btn-danger" onclick='excluirEvolucao(${e.id})'>Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar evoluções:', error);
    }
}
                        <button class="btn btn-sm btn-danger" onclick='excluirEvolucao(${e.id})'>Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar evoluções:', error);
    }
}

// EDITAR EVOLUÇÃO
async function editarEvolucao(id) {
    try {
        const response = await fetch(`/api/evolucao/${id}`);
        const e = await response.json();
        const form = document.getElementById("formEditEvolucao");

        form.id.value = e.id;
        form.atleta_id.value = e.atleta_id;
        form.peso.value = e.peso;
        form.altura.value = e.altura || '';
        form.imc.value = e.imc || '';
        form.massa_muscular.value = e.massa_muscular || '';
        form.gordura_corporal.value = e.gordura_corporal || '';
        form.data_medicao.value = e.data_medicao ? new Date(e.data_medicao).toISOString().slice(0, 16) : '';
        form.observacoes.value = e.observacoes || '';

        new bootstrap.Modal(document.getElementById("modalEditEvolucao")).show();
    } catch (error) {
        console.error('Erro ao carregar evolução para edição:', error);
    }
}

// EXCLUIR EVOLUÇÃO
async function excluirEvolucao(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        const response = await fetch(`/api/evolucao/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarEvolucao();
        }
    } catch (error) {
        console.error('Erro ao excluir evolução:', error);
    }
}
