/*
 * Modelos controle de estoque front-end AqGoEs versão 1.0.0
 * Script compartilhado por todas as páginas internas do sistema.
 *
 * Os elementos HTML são ligados a este arquivo por atributos data-*:
 *   data-toggle-sidebar        abre/fecha o menu lateral (mobile)
 *   data-toggle-user-menu      abre/fecha o menu do usuário
 *   data-open-modal="id"       abre o modal com o id informado
 *   data-close-modal="id"      fecha o modal com o id informado
 *   data-action="..."          ações específicas (ver `acoes`)
 */
(function () {
    'use strict';

    /* ---------- Ícones ---------- */
    function iniciarIcones() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /* ---------- Menu lateral ---------- */
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }

    /* ---------- Menu do usuário ---------- */
    function toggleUserMenu() {
        const menu = document.getElementById('userMenuDropdown');
        if (menu) menu.classList.toggle('hidden');
    }

    function fecharUserMenu() {
        const menu = document.getElementById('userMenuDropdown');
        if (menu) menu.classList.add('hidden');
    }

    /* ---------- Modais ---------- */
    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('hidden');
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('hidden');
    }

    /* ---------- Cadastro rápido (produtos.html) ---------- */
    // selectId: <select> com a opção value="nova"; modalId/inputId: modal e campo de cadastro rápido
    const cadastrosRapidos = {
        categoria:  { selectId: 'selectCategoria',  modalId: 'categoriaModal',  inputId: 'novaCategoriaInput' },
        fornecedor: { selectId: 'selectFornecedor', modalId: 'fornecedorModal', inputId: 'novoFornecedorInput' }
    };

    function abrirCadastroRapido(cfg) {
        const select = document.getElementById(cfg.selectId);
        if (select) select.value = '';
        openModal(cfg.modalId);
        const input = document.getElementById(cfg.inputId);
        if (input) input.focus();
    }

    function salvarCadastroRapido(cfg) {
        const input = document.getElementById(cfg.inputId);
        const select = document.getElementById(cfg.selectId);
        if (!input || !select) return;

        const nome = input.value.trim();
        if (!nome) {
            input.focus();
            return;
        }

        // Evita duplicar uma opção já existente (ignora maiúsculas/minúsculas)
        let opcao = Array.from(select.options).find(function (o) {
            return o.value.toLowerCase() === nome.toLowerCase();
        });
        if (!opcao) {
            opcao = new Option(nome, nome);
            select.insertBefore(opcao, select.querySelector('option[value="nova"]'));
        }
        select.value = opcao.value;

        input.value = '';
        closeModal(cfg.modalId);
    }

    function iniciarCadastrosRapidos() {
        Object.keys(cadastrosRapidos).forEach(function (chave) {
            const cfg = cadastrosRapidos[chave];
            const select = document.getElementById(cfg.selectId);
            if (!select) return;
            select.addEventListener('change', function () {
                if (select.value === 'nova') abrirCadastroRapido(cfg);
            });
        });
    }

    /* ---------- Ações por data-action ---------- */
    const acoes = {
        'salvar-categoria':  function () { salvarCadastroRapido(cadastrosRapidos.categoria); },
        'salvar-fornecedor': function () { salvarCadastroRapido(cadastrosRapidos.fornecedor); },
        'exportar-logs':     function () { alert('Funcionalidade de exportação de logs'); }
    };

    /* ---------- Eventos ---------- */
    document.addEventListener('click', function (e) {
        const alvo = e.target.closest(
            '[data-toggle-sidebar], [data-toggle-user-menu], [data-open-modal], [data-close-modal], [data-action]'
        );

        // Clique fora do menu do usuário fecha o menu
        if (!e.target.closest('[data-user-menu]')) fecharUserMenu();
        if (!alvo) return;

        if (alvo.hasAttribute('data-toggle-sidebar')) toggleSidebar();
        else if (alvo.hasAttribute('data-toggle-user-menu')) toggleUserMenu();
        else if (alvo.hasAttribute('data-open-modal')) openModal(alvo.getAttribute('data-open-modal'));
        else if (alvo.hasAttribute('data-close-modal')) closeModal(alvo.getAttribute('data-close-modal'));
        else if (alvo.hasAttribute('data-action')) {
            const acao = acoes[alvo.getAttribute('data-action')];
            if (acao) acao();
        }
    });

    // Formulários dentro de modais: evita recarregar a página (front-end estático).
    // Ao integrar com o back-end, substitua por envio real (fetch/HTMX).
    document.addEventListener('submit', function (e) {
        const modal = e.target.closest('[id$="Modal"]');
        if (!modal) return;
        e.preventDefault();
        e.target.reset();
        modal.classList.add('hidden');
    });

    iniciarIcones();
    iniciarCadastrosRapidos();
})();
