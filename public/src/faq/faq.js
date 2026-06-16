document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-container');
    const searchInput = document.getElementById('search-input');
    let faqData = [];

    // Fetch FAQ data
    fetch('faq_data.json')
        .then(response => response.json())
        .then(data => {
            faqData = data;
            renderFAQ(faqData);
        })
        .catch(error => console.error('Erro ao carregar FAQ:', error));

    // Helper to get icons
    function getCategoryIcon(category) {
        const icons = {
            'Geral': 'bi-info-circle',
            'Ciência da Computação': 'bi-code-slash',
            'TMSI': 'bi-hdd-network',
            'default': 'bi-question-circle'
        };
        return icons[category] || icons['default'];
    }

    function getSubcategoryIcon(subcategory) {
        const icons = {
            'Institucional': 'bi-building',
            'Ingresso': 'bi-door-open',
            'Candidatos': 'bi-person-plus',
            'Alunos': 'bi-mortarboard',
            'default': 'bi-card-text'
        };
        return icons[subcategory] || icons['default'];
    }

    // Render FAQ items
    function renderFAQ(data) {
        faqContainer.innerHTML = '';
        
        if (data.length === 0) {
            faqContainer.innerHTML = '<div class="text-center py-5"><p class="text-muted">Nenhuma pergunta encontrada.</p></div>';
            return;
        }

        // Group by category and subcategory
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.category]) {
                groupedData[item.category] = {};
            }
            if (!groupedData[item.category][item.subcategory]) {
                groupedData[item.category][item.subcategory] = [];
            }
            groupedData[item.category][item.subcategory].push(item);
        });

        // Create HTML structure
        for (const [category, subcategories] of Object.entries(groupedData)) {
            // Category Title
            const categorySection = document.createElement('div');
            categorySection.className = 'faq-category-section mb-5';
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-main-title mb-4';
            const catIcon = getCategoryIcon(category);
            categoryTitle.innerHTML = `<i class="bi ${catIcon} me-2"></i> ${category}`;
            categorySection.appendChild(categoryTitle);

            const subcategoryRow = document.createElement('div');
            subcategoryRow.className = 'row g-4';

            for (const [subcategory, items] of Object.entries(subcategories)) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-6'; // Two columns for subcategories

                const cardDiv = document.createElement('div');
                cardDiv.className = 'subcategory-card h-100';

                const subcategoryTitle = document.createElement('h3');
                subcategoryTitle.className = 'subcategory-title mb-3 d-flex align-items-center';
                const subIcon = getSubcategoryIcon(subcategory);
                subcategoryTitle.innerHTML = `<i class="bi ${subIcon} me-2 text-success"></i> ${subcategory}`;
                cardDiv.appendChild(subcategoryTitle);

                const accordionId = `accordion-${category.replace(/\s+/g, '-')}-${subcategory.replace(/\s+/g, '-')}`;
                const accordionDiv = document.createElement('div');
                accordionDiv.className = 'accordion accordion-flush'; // Flush style for inside cards
                accordionDiv.id = accordionId;

                items.forEach((item) => {
                    const itemId = `collapse-${item.id}`;
                    const headingId = `heading-${item.id}`;
                    
                    const accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item';
                    
                    accordionItem.innerHTML = `
                        <h2 class="accordion-header" id="${headingId}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${itemId}" aria-expanded="false" aria-controls="${itemId}">
                                ${item.question}
                            </button>
                        </h2>
                        <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#${accordionId}">
                            <div class="accordion-body">
                                ${item.answer}
                            </div>
                        </div>
                    `;
                    
                    accordionDiv.appendChild(accordionItem);
                });

                cardDiv.appendChild(accordionDiv);
                colDiv.appendChild(cardDiv);
                subcategoryRow.appendChild(colDiv);
            }

            categorySection.appendChild(subcategoryRow);
            faqContainer.appendChild(categorySection);
        }
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredData = faqData.filter(item => 
            item.question.toLowerCase().includes(searchTerm) || 
            item.answer.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm))
        );

        renderFAQ(filteredData);
    });
});