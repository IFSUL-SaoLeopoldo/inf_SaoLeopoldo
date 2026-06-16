const CONFIG = {
    SUAP_AUTH_HOST: 'https://suap.ifsul.edu.br',
    SUAP_CLIENT_ID: 'aq0Ftd6lhzIulKumRH14a2MrmLBC2hAEFB9GaGPM',
    // Usa a URL da home como redirect fixa, pois está cadastrada no SUAP
    SUAP_REDIRECT_URI: window.location.origin + '/src/home/index.html',
    // API_BASE_URL: window.location.protocol + '//' + window.location.hostname + ':3000'
    API_BASE_URL: '/api'
};

// 1. Redirecionar para o login do SUAP
function redirectToSuapLogin() {
    // Salva a página atual para retornar após o login
    localStorage.setItem('suap_redirect_back', window.location.href);

    const loginUrl = `${CONFIG.SUAP_AUTH_HOST}/o/authorize/` +
        `?response_type=token` +
        `&client_id=${CONFIG.SUAP_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(CONFIG.SUAP_REDIRECT_URI)}` +
        `&scope=identificacao` +
        `&grant_type=implicit`;
    window.location.href = loginUrl;
}

// 2. Capturar Token da URL e Salvar no Backend via Cookie
async function processToken() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');

    if (token) {
        await fetch(`${CONFIG.API_BASE_URL}/save-token`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        });
        // Limpar a URL retirando o token da visão do usuário
        history.replaceState(null, '', window.location.pathname);

        // Redireciona de volta para a página original
        const redirectBack = localStorage.getItem('suap_redirect_back');
        if (redirectBack && redirectBack.startsWith(window.location.origin)) {
            localStorage.removeItem('suap_redirect_back');
            window.location.href = redirectBack;
        }
    }
}

// 3. Buscar Dados do Usuário e Atualizar Navbar
async function getUserData() {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/meus-dados`, {
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            
            // Ocultar Botões de Login
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) loginBtn.style.display = 'none';
            const loginBtnMobile = document.getElementById('login-btn-mobile');
            if (loginBtnMobile) loginBtnMobile.style.display = 'none';

            // Mostrar Informações do Usuário (Nome e Imagem)
            const name = data.nome_usual || data.nome;
            const photo = data.url_foto_75x100 || data.url_foto || 'https://suap.ifsul.edu.br/static/comum/img/default.jpg';

            const userName = document.getElementById('user-name');
            if (userName) userName.textContent = name;
            const userNameMobile = document.getElementById('user-name-mobile');
            if (userNameMobile) userNameMobile.textContent = name;

            const userImage = document.getElementById('user-image');
            if (userImage) userImage.src = photo;
            const userImageMobile = document.getElementById('user-image-mobile');
            if (userImageMobile) userImageMobile.src = photo;

            // Tornar a área de informações e botão de Sair visível
            const userInfo = document.getElementById('user-info');
            if (userInfo) userInfo.style.display = 'flex';
            const userInfoMobile = document.getElementById('user-info-mobile');
            if (userInfoMobile) userInfoMobile.style.display = 'flex';

            // Mostrar link Documentos Professores para usuários autorizados
            const navDocs = document.getElementById('nav-documentos-professores');
            if (navDocs) navDocs.style.display = 'block';
            const navDocsMobile = document.getElementById('nav-documentos-professores-mobile');
            if (navDocsMobile) navDocsMobile.style.display = 'block';
        } else {
            const errData = await res.json().catch(() => ({}));
            if (res.status === 403) {
                alert('Acesso negado: ' + (errData.error || 'Somente professores e funcionários têm permissão.'));
                // Remove o cookie inválido para "resetar" o login
                removeToken();
            } else if (res.status === 401) {
                console.warn('Sessão expirada ou não autenticado.');
            }
        }
    } catch (err) {
        console.error("Usuário não autenticado ou sem permissão", err);
    }
}

// 4. Efetuar Logout
async function removeToken() {
    await fetch(`${CONFIG.API_BASE_URL}/remove-token`, {
        method: 'POST',
        credentials: 'include'
    });
    window.location.reload();
}

// Inicialização da Autenticação
function initSuapAuth() {
    (async () => {
        await processToken(); // Salva o token se estiver voltando do SUAP
        await getUserData();  // Busca os dados e monta a navbar se logado com sucesso
    })();
}

// 5. Inicialização das interações da navbar (mobile menu, scroll, etc.)
function initNavbarInteractions() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        // Evita duplicar event listeners
        if (hamburger.dataset.listenerAdded) return;
        hamburger.dataset.listenerAdded = 'true';

        const bar1 = document.getElementById('bar1');
        const bar2 = document.getElementById('bar2');
        const bar3 = document.getElementById('bar3');

        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            if (isOpen) {
                bar1.style.transform = 'translateY(6px) rotate(45deg)';
                bar2.style.opacity = '0';
                bar3.style.transform = 'translateY(-6px) rotate(-45deg)';
            } else {
                bar1.style.transform = 'none';
                bar2.style.opacity = '1';
                bar3.style.transform = 'none';
            }
        });
    }

    // Efeito de scroll no header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Expõe a função globalmente para controle do menu mobile
window.toggleMobileSub = function(id, btn) {
    const subMenu = document.getElementById(id);
    if (subMenu) {
        const isOpen = subMenu.classList.toggle('open');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.transform = isOpen ? 'rotate(180deg)' : 'none';
            icon.style.transition = 'transform 0.2s ease';
        }
    }
};

// Como a navbar é injetada via fetch(), precisamos observar quando os elementos do SUAP aparecem no DOM
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    initSuapAuth();
    initNavbarInteractions();
} else {
    const observer = new MutationObserver((mutations, obs) => {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            initSuapAuth();
            initNavbarInteractions();
            obs.disconnect(); // Para de observar quando encontra
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
