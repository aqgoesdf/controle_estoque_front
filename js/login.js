/*
 * Modelos controle de estoque AqGoEs versão 1.0.0
 * Comportamento da tela de login (HTMX).
 */
(function () {
    'use strict';

    const spinner = document.getElementById('loading-spinner');
    const alvoErro = document.getElementById('erro-login');

    function mostrarSpinner() {
        if (spinner) spinner.style.display = 'inline-block';
    }

    function esconderSpinner() {
        if (spinner) spinner.style.display = 'none';
    }

    function mostrarErro(mensagem) {
        if (!alvoErro) return;
        const aviso = document.createElement('div');
        aviso.className = 'p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs';
        aviso.textContent = mensagem;
        alvoErro.replaceChildren(aviso);
    }

    // Início da requisição: limpa erro anterior e mostra o indicador
    document.addEventListener('htmx:configRequest', function () {
        if (alvoErro) alvoErro.replaceChildren();
        mostrarSpinner();
    });

    // Fim da requisição (sucesso ou falha): esconde o indicador
    document.addEventListener('htmx:afterRequest', esconderSpinner);

    // Respostas 4xx com HTML de erro do servidor também devem ser exibidas no alvo
    document.addEventListener('htmx:beforeSwap', function (evt) {
        if ([400, 401, 403, 422].indexOf(evt.detail.xhr.status) !== -1 && evt.detail.serverResponse) {
            evt.detail.shouldSwap = true;
            evt.detail.isError = false;
        }
    });

    // Erro HTTP sem corpo para exibir
    document.addEventListener('htmx:responseError', function (evt) {
        const status = evt.detail.xhr.status;
        mostrarErro(status === 401 || status === 403
            ? 'E-mail ou senha inválidos.'
            : 'Erro no servidor. Tente novamente mais tarde.');
    });

    // Falha de rede / servidor indisponível
    document.addEventListener('htmx:sendError', function () {
        mostrarErro('Não foi possível conectar ao servidor.');
    });
})();
