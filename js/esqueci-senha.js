/*
 * Modelos controle de estoque AqGoEs versão 1.0.0
 * Comportamento da tela de recuperação de senha.
 */
(function () {
    'use strict';

    if (window.lucide) {
        window.lucide.createIcons();
    }

    const form = document.getElementById('form-recuperar');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Instruções enviadas para o e-mail informado!');
    });
})();
