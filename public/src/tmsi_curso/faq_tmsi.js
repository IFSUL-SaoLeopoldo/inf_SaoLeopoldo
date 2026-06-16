document.addEventListener('DOMContentLoaded', () => {
    const faqTabs = document.getElementById('faqTabs');
    const faqTabsContent = document.getElementById('faqTabsContent');
    const searchInput = document.getElementById('search-input');
    let faqData = [];

    // Busca os dados da fonte local e da principal
    Promise.all([
        fetch('faq_tmsi_data.json').then(res => res.json()).catch((e) => {
            // Tenta pegar de faq_data.json local como fallback
            return fetch('faq_data.json').then(res => res.json()).catch(() => []);
        }),
        fetch('../faq/faq_data.json').then(res => res.json()).catch(() => [])
    ])
    .then(([localData, faqGeneralData]) => {
        // Filtra do faq geral o que é válido para TMSI
        const relevantFaq = faqGeneralData.filter(item => 
            item.category === 'TMSI' || item.category === 'Geral'
        );
        
        // Remove duplicatas que já existem no JSON local
        const localQuestions = localData.map(item => item.question.trim().toLowerCase());
        const uniqueRelevantFaq = relevantFaq.filter(item => 
            !localQuestions.includes(item.question.trim().toLowerCase())
        );

        // Junta tudo, dando prioridade ao arquivo local
        faqData = [...localData, ...uniqueRelevantFaq];
        renderFAQ(faqData);
    })

    function renderFAQ(data) {
        faqTabs.innerHTML = '';
        faqTabsContent.innerHTML = '';
        
        if (data.length === 0) {
            faqTabsContent.innerHTML = '<div class="text-center py-5"><p class="text-muted">Nenhuma pergunta encontrada.</p></div>';
            return;
        }

        // Agrupa as perguntas para criar as abas
        const groupedData = {};
        data.forEach(item => {
            let tabName = item.subcategory || 'Geral';
            // Unifica termos do JSON com as abas do HTML do TMSI
            if (tabName === 'Ingresso' || tabName === 'Candidatos' || tabName === 'Institucional') {
                tabName = 'Quero Ingressar';
            }
            if (!groupedData[tabName]) {
                groupedData[tabName] = [];
            }
            groupedData[tabName].push(item);
        });

        const tabNames = Object.keys(groupedData);
        
        tabNames.forEach((tabName, index) => {
            const safeId = tabName.replace(/\s+/g, '-').toLowerCase();
            const isActive = index === 0 ? 'active' : '';
            const isShow = index === 0 ? 'show active' : '';

            // Criação da Aba
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.setAttribute('role', 'presentation');
            li.innerHTML = `
                <button class="nav-link ${isActive}" id="${safeId}-tab" data-bs-toggle="tab"
                    data-bs-target="#${safeId}" type="button" role="tab">
                    ${tabName}
                </button>
            `;
            faqTabs.appendChild(li);

            // Criação do Painel de Conteúdo
            const tabPane = document.createElement('div');
            tabPane.className = `tab-pane fade ${isShow}`;
            tabPane.id = safeId;
            tabPane.setAttribute('role', 'tabpanel');

            // Criação do Acordeão
            const accordionDiv = document.createElement('div');
            accordionDiv.className = 'accordion';
            accordionDiv.id = `accordion-${safeId}`;

            groupedData[tabName].forEach((item, itemIdx) => {
                const itemId = `${safeId}-item-${itemIdx}`;
                const headingId = `heading-${itemId}`;
                
                const isItemShow = '';
                const isBtnCollapsed = 'collapsed';
                
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                
                accordionItem.innerHTML = `
                    <h2 class="accordion-header" id="${headingId}">
                        <button class="accordion-button ${isBtnCollapsed}" type="button" data-bs-toggle="collapse"
                            data-bs-target="#${itemId}">
                            ${item.question}
                        </button>
                    </h2>
                    <div id="${itemId}" class="accordion-collapse collapse ${isItemShow}"
                        data-bs-parent="#accordion-${safeId}">
                        <div class="accordion-body">
                            ${item.answer}
                        </div>
                    </div>
                `;
                accordionDiv.appendChild(accordionItem);
            });

            tabPane.appendChild(accordionDiv);
            faqTabsContent.appendChild(tabPane);
        });
    }

    // Busca
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            renderFAQ(faqData);
            return;
        }

        const filteredData = faqData.filter(item => 
            item.question.toLowerCase().includes(searchTerm) || 
            item.answer.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm))
        );

        renderFAQ(filteredData);
    });
});