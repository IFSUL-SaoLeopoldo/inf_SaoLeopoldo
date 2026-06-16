(function() {

    'use strict';

const API_URL = [

    'https://painel.passofundo.ifsul.edu.br/ws/?ws=professor', // 1. API direta 

];

   


//     const API_URL = [

//     'https://api.allorigins.win/raw?url=https://painel.passofundo.ifsul.edu.br/ws/?ws=professor', // Proxy (Prioridade 1)

//     './proxy.php', // Proxy local

//     'https://corsproxy.io/?https://painel.passofundo.ifsul.edu.br/ws/?ws=professor', // Proxy público 2

//     'https://painel.passofundo.ifsul.edu.br/ws/?ws=professor' // API direta (Última tentativa)

//    ];



    const container = document.querySelector('#time .row.g-4');



    /**

     * Cria o HTML de um card de professor

     * @param {Object} prof - Objeto com dados do professor

     * @returns {string} HTML do card

     */

    function criarCardProfessor(prof) {

        const { nome, email, curriculo, titulacao, interesse, img } = prof;

       

        return `

            <div class="col-md-4">

                <div class="card-container">

                    <div class="card-inner">

                        <div class="card-front">

                            <div class="event-card text-center">

                                <img src="${img}"

                                    alt="${nome}"

                                    class="speaker-image mb-3"

                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"

                                    onload="this.style.display='block'; this.nextElementSibling.style.display='none';">

                                <div class="placeholder-icon mb-3" style="display:none; width:200px; height:200px; margin:0 auto; background:#e9ecef; border-radius:50%; align-items:center; justify-content:center; color:#6c757d; border:4px solid #dee2e6;">

                                    <i class="bi bi-person-circle" style="font-size: 100px;"></i>

                                </div>

                                <h4 class="event-title mb-2">${nome}</h4>

                                <p class="mb-2">${titulacao}</p>

                            </div>

                        </div>

                        <div class="card-back">

                            <h5>Tópicos de Interesse:</h5>

                            <p class="text-justify">${interesse || 'Não informado'}</p>
                            
                            <div class="social-links">
               ${curriculo ? `<a href="${curriculo}" target="_blank" class="download-link"><i class="bi bi-link-45deg"></i> Lattes</a>` : ''}

<hr>

                                ${email ? `<a href="mailto:${email}" target="_blank" class="download-link">  <i class="bi bi-envelope"></i> ${email}</a>` : ''}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }



    /**

     * Carrega os professores da API do painel IFSul

     */

async function carregarProfessores() {

    let response;

    let urlUsada;



    // 1. Tenta fazer o fetch em cada URL da lista

    for (const url of API_URL) {

        try {

            console.log(`🔄 Tentando carregar de: ${url}`);

            response = await fetch(url, {

                method: 'GET',

                headers: {

                    'Accept': 'application/json',

                    'Content-Type': 'application/json'

                }

            });



            if (response.ok) {

                console.log(`✅ Sucesso com: ${url}`);

                urlUsada = url;

                break; // Encontrou uma URL válida, sai do loop

            } else {

                // A requisição foi feita, mas o servidor retornou um erro (ex: 404, 500)

                console.warn(`⚠️ Falha (HTTP ${response.status}) com: ${url}`);

            }

        } catch (error) {

            // Erro de rede ou CORS bloqueado (não conseguiu nem completar a requisição)

            console.error(`❌ Erro de fetch com: ${url}`, error.message);

        }

    }



    // 2. Se 'response' não for válido após o loop, deu erro em todas

    if (!response || !response.ok) {

        console.error('❌ Todas as tentativas de API falharam.');



        let mensagemErro = `

            <div class="alert alert-danger" role="alert">

                <h5><i class="bi bi-exclamation-triangle"></i> Erro ao carregar professores</h5>

                <p>Não foi possível conectar a nenhuma das fontes de dados (API direta ou Proxies). Verifique sua conexão ou tente mais tarde.</p>

                <button class="btn btn-sm btn-primary mt-2" onclick="location.reload()">

                    <i class="bi bi-arrow-clockwise"></i> Tentar novamente

                </button>

            </div>

        `;

        container.innerHTML = `<div class="col-12">${mensagemErro}</div>`;

        return;

    }



    // 3. Se deu certo, continua com o resto da sua função original

    try {

        const data = await response.json();



        // Limpa o container

        container.innerHTML = '';



        // Verifica se há dados

        if (!data || data.length === 0) {

            container.innerHTML = `

                <div class="col-12 text-center">

                    <div class="alert alert-info" role="alert">

                        <i class="bi bi-info-circle"></i>

                        Nenhum professor encontrado no momento.

                    </div>

                </div>

            `;

            return;

        }



        // Cria os cards para cada professor

        data.forEach(item => {

            if (item.professor) {

                const cardHTML = criarCardProfessor(item.professor);

                container.insertAdjacentHTML('beforeend', cardHTML);

            }

        });



        console.log(`✅ ${data.length} professores carregados com sucesso de ${urlUsada}!`);



        // Dispara evento customizado

        const event = new CustomEvent('cardsCarregados', {

            detail: { quantidade: data.length }

        });

        document.dispatchEvent(event);



    } catch (jsonError) {

        // O fetch funcionou (response.ok) mas o JSON é inválido

        console.error('❌ Erro ao processar o JSON:', jsonError);

        container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao ler os dados recebidos da API. O formato é inválido.</div></div>`;

    }

}



    // Carrega os professores quando o DOM estiver pronto

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', carregarProfessores);

    } else {

        carregarProfessores();

    }

})();