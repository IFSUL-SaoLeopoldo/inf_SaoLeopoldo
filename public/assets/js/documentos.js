// inf/assets/js/documentos.js

// const API_BASE_URL_DOCS = window.location.protocol + '//' + window.location.hostname + ':3000';
let currentDocs = [];
const API_BASE_URL_DOCS = '/api';


document.addEventListener('DOMContentLoaded', () => {
    verificarAcesso();

    document.getElementById('form-documento').addEventListener('submit', handleFormSubmit);

    // Reseta o form quando o modal for fechado
    const modalDocumento = document.getElementById('modalDocumento');
    modalDocumento.addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-documento').reset();
        document.getElementById('doc-id').value = '';
        document.getElementById('modalDocumentoLabel').textContent = 'Adicionar Documento';
        document.getElementById('campo-arquivo').style.display = 'block';
        document.getElementById('documento').setAttribute('required', 'required');
    });
});

async function verificarAcesso() {
    try {
        const res = await fetch(`${API_BASE_URL_DOCS}/meus-dados`, {
            credentials: 'include'
        });

        if (res.ok) {
            // Usuário autorizado (professores/funcionários)
            document.getElementById('btn-novo-documento').style.display = 'inline-flex';
            carregarDocumentos();
        } else {
            // Não autorizado
            alert("Acesso negado. Apenas professores e funcionários podem acessar esta página.");
            window.location.href = '../home/index.html';
        }
    } catch (error) {
        console.error("Erro ao verificar acesso:", error);
        alert("Erro de conexão.");
        window.location.href = '../home/index.html';
    }
}

async function carregarDocumentos() {
    const listContainer = document.getElementById('documentos-list');

    try {
        const res = await fetch(`${API_BASE_URL_DOCS}/documentos`, {
            credentials: 'include'
        });

        if (res.ok) {
            currentDocs = await res.json();
            renderizarDocumentos(currentDocs);
        } else {
            listContainer.innerHTML = '<p class="text-center text-danger">Erro ao carregar documentos.</p>';
        }
    } catch (error) {
        console.error(error);
        listContainer.innerHTML = '<p class="text-center text-danger">Erro de conexão com o servidor.</p>';
    }
}

function getIconClass(extensao) {
    if (extensao === '.pdf') return 'bi-file-earmark-pdf-fill pdf';
    if (extensao === '.docx') return 'bi-file-earmark-word-fill docx';
    if (extensao === '.xlsx') return 'bi-file-earmark-excel-fill xlsx';
    return 'bi-file-earmark-text-fill';
}

function renderizarDocumentos(docs) {
    const listContainer = document.getElementById('documentos-list');

    if (docs.length === 0) {
        listContainer.innerHTML = '<p class="text-center">Nenhum documento encontrado.</p>';
        return;
    }

    let html = '';
    docs.forEach(doc => {
        const dataFormatada = new Date(doc.data_adicionado).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const iconClass = getIconClass(doc.extensao);
        const fileUrl = `${API_BASE_URL_DOCS}/uploads/${doc.nome_arquivo}`;

        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="doc-card">
                    <div class="doc-header">
                        <i class="bi ${iconClass} doc-icon"></i>
                        <h3 class="doc-title">${doc.titulo}</h3>
                    </div>
                    <div class="doc-body">
                        <div class="doc-meta">
                            <span><i class="bi bi-person"></i> Adicionado por: ${doc.adicionado_por}</span>
                            <span><i class="bi bi-calendar3"></i> Em: ${dataFormatada}</span>
                        </div>
                        <div class="doc-desc">
                            ${doc.descricao}
                        </div>
                    </div>
                    <div class="doc-footer">
                        <a href="${fileUrl}" target="_blank" class="btn-download">
                            <i class="bi bi-download"></i> Baixar
                        </a>
                        <div class="doc-actions">
                            <button class="btn-action edit" onclick="editarDocumento(${doc.id})" title="Editar Informações">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn-action delete" onclick="excluirDocumento(${doc.id})" title="Excluir">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const docId = document.getElementById('doc-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    if (docId) {
        // Atualizar (PUT) - apenas texto
        atualizarDocumento(docId, titulo, descricao);
    } else {
        // Criar (POST) - com arquivo
        const fileInput = document.getElementById('documento');
        if (!fileInput.files.length) {
            alert("Selecione um arquivo.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        formData.append('documento', file);

        salvarNovoDocumento(formData);
    }
}

async function salvarNovoDocumento(formData) {
    const btn = document.getElementById('btn-salvar-doc');
    btn.disabled = true;
    btn.innerHTML = 'Salvando...';

    try {
        const res = await fetch(`${API_BASE_URL_DOCS}/documentos`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (res.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDocumento'));
            modal.hide();
            carregarDocumentos();
        } else {
            const err = await res.json();
            alert(err.error || "Erro ao salvar documento.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Salvar';
    }
}

async function atualizarDocumento(id, titulo, descricao) {
    const btn = document.getElementById('btn-salvar-doc');
    btn.disabled = true;
    btn.innerHTML = 'Atualizando...';

    try {
        const res = await fetch(`${API_BASE_URL_DOCS}/documentos/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao })
        });

        if (res.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDocumento'));
            modal.hide();
            carregarDocumentos();
        } else {
            const err = await res.json();
            alert(err.error || "Erro ao atualizar documento.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Salvar';
    }
}

function editarDocumento(id) {
    const doc = currentDocs.find(d => d.id === id);
    if (!doc) return;

    document.getElementById('doc-id').value = doc.id;
    document.getElementById('titulo').value = doc.titulo;
    document.getElementById('descricao').value = doc.descricao;

    document.getElementById('modalDocumentoLabel').textContent = 'Editar Informações do Documento';

    // Ocultar campo de upload (edição é só texto)
    document.getElementById('campo-arquivo').style.display = 'none';
    document.getElementById('documento').removeAttribute('required');

    const modal = new bootstrap.Modal(document.getElementById('modalDocumento'));
    modal.show();
}

async function excluirDocumento(id) {
    if (!confirm("Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.")) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL_DOCS}/documentos/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (res.ok) {
            carregarDocumentos();
        } else {
            const err = await res.json();
            alert(err.error || "Erro ao excluir documento.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}
