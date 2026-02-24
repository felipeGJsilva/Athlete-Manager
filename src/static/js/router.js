async function carregarBase() {
    const app = document.getElementById("app");
    app.innerHTML = await fetch("src/views/base/base.html").then(r => r.text());
}

async function carregarPagina(p) {
    document.getElementById("conteudo").innerHTML =
        await fetch(`src/views/base/${p}.html`).then(r => r.text());

    const init = window[`init_${p}`];
    if (init) init();
}

window.addEventListener("hashchange", () => {
    carregarPagina(location.hash.replace("#/", "") || "atletas");
});

carregarBase().then(() => carregarPagina("atletas"));
