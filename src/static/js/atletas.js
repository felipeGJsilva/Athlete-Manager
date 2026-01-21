// ======================
// INICIALIZAÇÃO
// ======================
document.addEventListener('DOMContentLoaded', () => {
    carregarAtletas();
});

// ======================
// FUNÇÃO ADICIONAR
// ======================
document.getElementById("formAddAtleta").onsubmit = async e => {
    e.preventDefault();

    const form = e.target;

    let foto = await carregarImagem(document.getElementById("fotoAdd").files[0]);

    const atleta = {
        nome: form.nome.value,
        email: form.email.value,
        esporte: form.esporte.value,
        posicao: form.posicao.value,
        idade: parseInt(form.idade.value),
        altura: parseFloat(form.altura.value),
        peso: parseFloat(form.peso.value),
        foto: foto || "default"
    };

    try {
        const response = await fetch('/api/atletas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atleta)
        });
        if (response.ok) {
            form.reset();
            carregarAtletas();
            bootstrap.Modal.getInstance(document.getElementById("modalAddAtleta")).hide();
        }
    } catch (error) {
        console.error('Erro ao adicionar atleta:', error);
    }
};

// ======================
// FUNÇÃO VINCULAR ATLETA
// ======================
document.getElementById("formVincularAtleta").onsubmit = async e => {
    e.preventDefault();

    const form = e.target;

    const data = {
        email: form.email.value
    };

    try {
        const response = await fetch('/api/atletas/vincular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            form.reset();
            carregarAtletas();
            bootstrap.Modal.getInstance(document.getElementById("modalVincularAtleta")).hide();
        } else {
            alert(result.error || 'Erro ao vincular atleta');
        }
    } catch (error) {
        console.error('Erro ao vincular atleta:', error);
        alert('Erro de rede ao vincular atleta');
    }
};

// ======================
// FUNÇÃO EDITAR
// ======================
document.getElementById("formEditAtleta").onsubmit = async e => {
    e.preventDefault();
    const form = e.target;

    let novaFoto = document.getElementById("fotoEdit").files[0];
    let fotoConvertida = novaFoto ? await carregarImagem(novaFoto) : null;

    const atleta = {
        nome: form.nome.value,
        email: form.email.value,
        esporte: form.esporte.value,
        posicao: form.posicao.value,
        idade: parseInt(form.idade.value),
        altura: parseFloat(form.altura.value),
        peso: parseFloat(form.peso.value),
        foto: fotoConvertida || form.getAttribute("data-foto-original")
    };

    const id = form.id.value;

    try {
        const response = await fetch(`/api/atletas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atleta)
        });
        if (response.ok) {
            carregarAtletas();
            bootstrap.Modal.getInstance(document.getElementById("modalEditAtleta")).hide();
        }
    } catch (error) {
        console.error('Erro ao editar atleta:', error);
    }
};

// ======================
// CARREGAR ATLETAS
// ======================
async function carregarAtletas() {
    try {
        const response = await fetch('/api/atletas');
        const atletas = await response.json();
        const lista = document.getElementById("lista-atletas");
        lista.innerHTML = atletas.map(a => `
            <div class="dash-card">
                <img src="${a.foto === "default" ? "../../static/img/default-user.png" : a.foto}" class="atleta-foto">
                <div class="atleta-info">
                    <h4>${a.nome}</h4>
                    <p><strong>Esporte:</strong> ${a.esporte}</p>
                    <p><strong>Posição/Prova:</strong> ${a.posicao}</p>
                    <p><strong>Idade:</strong> ${a.idade} anos</p>
                    <p><strong>Altura:</strong> ${a.altura} m</p>
                    <p><strong>Peso:</strong> ${a.peso} kg</p>

                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-sm btn-primary" onclick='editarAtleta(${a.id})'>Editar</button>
                        <button class="btn btn-sm btn-danger" onclick='excluirAtleta(${a.id})'>Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar atletas:', error);
    }
}

// ======================
// FUNÇÕES EXTRA
// ======================
async function carregarImagem(file) {
    if (!file) return null;

    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

async function editarAtleta(id) {
    try {
        const response = await fetch(`/api/atletas/${id}`);
        const a = await response.json();
        const form = document.getElementById("formEditAtleta");

        form.id.value = a.id;
        form.nome.value = a.nome;
        form.email.value = a.email;
        form.esporte.value = a.esporte;
        form.posicao.value = a.posicao;
        form.idade.value = a.idade;
        form.altura.value = a.altura;
        form.peso.value = a.peso;

        form.setAttribute("data-foto-original", a.foto);

        new bootstrap.Modal(document.getElementById("modalEditAtleta")).show();
    } catch (error) {
        console.error('Erro ao carregar atleta para edição:', error);
    }
}

async function excluirAtleta(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        const response = await fetch(`/api/atletas/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarAtletas();
        }
    } catch (error) {
        console.error('Erro ao excluir atleta:', error);
    }
}
