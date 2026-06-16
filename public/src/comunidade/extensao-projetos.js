const EXTENSAO_API_URL = "https://extensao.passofundo.ifsul.edu.br/api" // 'http://localhost:3000/api';

async function carregarProjetosExtensao() {
  const container = document.getElementById('projetos-extensao-lista');
  if (!container) return;
 
  try {
    const response = await fetch(`${EXTENSAO_API_URL}/projetos`);
 
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
 
    const projetos = await response.json();
 
    if (!projetos || projetos.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-4">Nenhum projeto de extensão cadastrado no momento.</p>';
      return;
    }
 
    container.innerHTML = projetos.map(projeto => criarCardProjeto(projeto)).join('');
 
  } catch (error) {
    console.error('Erro ao carregar projetos de extensão:', error);
    container.innerHTML = '<p class="text-muted text-center py-4">Não foi possível carregar os projetos de extensão no momento.</p>';
  }
}


/*async function carregarProjetos() {
    try {
        const response = await fetch(`${URL_API_URL}/projetos`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const projetos = await response.json();
        console.log("Projetos carregados:", projetos);
        
        renderizarCardsNoNovoSite(projetos);

    } catch (error) {
        console.error("Erro:", error);
    }
}

carregarProjetos();
*/

function formatarData(dataString) {
  if (!dataString) return 'Data não definida';
  const data = new Date(dataString);
  const dataCorrigida = new Date(data.valueOf() + data.getTimezoneOffset() * 60000);
  return dataCorrigida.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
}
 
function criarCardProjeto(projeto) {
  const responsavel = projeto.membros?.find(m => m.responsavel);
  const statusClass = projeto.status === 'Finalizado' ? 'projeto-status--finalizado' : 'projeto-status--andamento';
  const statusLabel = projeto.status || 'Em andamento';
 
  const membrosList = projeto.membros && projeto.membros.length > 0
    ? projeto.membros.slice(0, 3).map(m => `
        <li class="projeto-membro-item" title="${m.nome}">
          ${m.image
            ? `<img src="${EXTENSAO_API_URL}/uploads/${m.image}" alt="${m.nome}" class="projeto-membro-avatar">`
            : `<span class="projeto-membro-avatar projeto-membro-avatar--fallback">${m.nome.charAt(0)}</span>`
          }
        </li>
      `).join('')
    : '';
 
  const membrosExtra = projeto.membros && projeto.membros.length > 3
    ? `<li class="projeto-membro-item"><span class="projeto-membro-avatar projeto-membro-avatar--extra">+${projeto.membros.length - 3}</span></li>`
    : '';
 
  return `
    <div class="col-lg-6 mb-4">
      <div class="group-card projeto-card">
        <div class="group-banner projeto-banner">
          ${projeto.capa
            ? `<img src="${EXTENSAO_API_URL}/uploads/${projeto.capa}" alt="${projeto.titulo}" class="group-image">`
            : `<div class="projeto-banner-placeholder"><i class="bi bi-mortarboard-fill"></i></div>`
          }
          <span class="projeto-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="group-content">
          <span class="group-label">PROJETO DE EXTENSÃO</span>
          <h3 class="group-title">${projeto.titulo}</h3>
          <p class="group-description">${projeto.descricao || 'Sem descrição disponível.'}</p>
 
          <ul class="group-features">
            ${projeto.cursos ? `<li><i class="bi bi-book-half"></i> ${projeto.cursos}</li>` : ''}
            ${projeto.data ? `<li><i class="bi bi-calendar-check"></i> ${formatarData(projeto.data)}</li>` : ''}
            ${responsavel ? `<li><i class="bi bi-person-badge-fill"></i> <strong style="color:#1a5f3a;">Responsável:</strong>&nbsp;${responsavel.nome}</li>` : ''}
          </ul>
 
          ${projeto.membros && projeto.membros.length > 0 ? `
            <div class="projeto-membros-row">
              <ul class="projeto-membros-lista">
                ${membrosList}
                ${membrosExtra}
              </ul>
              <span class="projeto-membros-label">${projeto.membros.length} membro${projeto.membros.length !== 1 ? 's' : ''}</span>
            </div>
          ` : ''}
 
          <div class="group-actions">
            ${responsavel && responsavel.email ? `
              <a href="mailto:${responsavel.email}?subject=[site INF] Interesse no projeto: ${encodeURIComponent(projeto.titulo)}"
                 target="_blank" class="btn-group">
                <i class="bi bi-envelope-fill me-2"></i>Contato do Responsável
              </a>
            ` : ''}
            <a href="${EXTENSAO_API_URL.replace('/api', '')}/src/projeto/projeto-detalhes.html?id=${projeto.id}"
               target="_blank" class="btn-group btn-group--outline">
              <i class="bi bi-arrow-right-circle me-2"></i>Ver Detalhes
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
document.addEventListener('DOMContentLoaded', carregarProjetosExtensao);
 