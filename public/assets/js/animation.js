document.addEventListener('DOMContentLoaded', function () {

    // 1. Adiciona UM "ouvinte" mestre ao documento inteiro
    document.addEventListener('click', function (event) {
        
        // 2. Verifica se o alvo do clique foi um link de download
        const downloadLink = event.target.closest('.download-link');
        if (downloadLink) {
            // Se foi, impede o card de virar e deixa o link funcionar
            event.stopPropagation();
            return; 
        }

        // 3. Verifica se o alvo do clique estava DENTRO de um card
        const cardContainer = event.target.closest('.card-container');
        if (cardContainer) {
            // Se estava, encontra o 'miolo' do card e aplica a classe 'is-flipped'
            const cardInner = cardContainer.querySelector('.card-inner');
            if (cardInner) {
                cardInner.classList.toggle('is-flipped');
            }
        }
        
    });
});