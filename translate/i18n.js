// ============================================
// SISTEMA DE TRADUÇÃO I18N
// ============================================

const I18n = {
    currentLocale: 'pt-BR',
    fallbackLocale: 'pt-BR',
    translations: {},
    listeners: [],
    
    // Inicializar
    async init() {
        // Carregar idioma salvo
        const saved = localStorage.getItem('academico_locale');
        if (saved && ['pt-BR', 'en-US', 'es-ES'].includes(saved)) {
            this.currentLocale = saved;
        } else {
            // Detectar idioma do navegador
            const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';
            if (browserLang.startsWith('en')) this.currentLocale = 'en-US';
            else if (browserLang.startsWith('es')) this.currentLocale = 'es-ES';
            else this.currentLocale = 'pt-BR';
        }
        
        await this.loadTranslations(this.currentLocale);
        this.applyTranslations();
        this.setupSelector();
        
        return this;
    },
    
    // Carregar traduções
    async loadTranslations(locale) {
        try {
            const response = await fetch(`/translate/locales/${locale}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.translations = await response.json();
            this.currentLocale = locale;
            localStorage.setItem('academico_locale', locale);
        } catch (error) {
            console.error('Erro ao carregar traduções:', error);
            // Fallback para português
            if (locale !== 'pt-BR') {
                await this.loadTranslations('pt-BR');
            }
        }
    },
    
    // Obter tradução
    t(key, params = {}) {
        let translation = this.translations[key];
        if (!translation) {
            // Verificar se é uma chave aninhada (ex: "header.title")
            const keys = key.split('.');
            let value = this.translations;
            for (const k of keys) {
                if (value && value[k] !== undefined) {
                    value = value[k];
                } else {
                    console.warn(`Tradução não encontrada: ${key}`);
                    return key;
                }
            }
            translation = value;
        }
        
        // Substituir parâmetros
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            for (const [k, v] of Object.entries(params)) {
                translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), v);
            }
        }
        
        return translation;
    },
    
    // Aplicar traduções ao DOM
    applyTranslations() {
        // Traduzir elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                // Verificar se é HTML
                if (el.innerHTML.includes('<') && translation.includes('<')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // Traduzir placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) el.placeholder = translation;
        });
        
        // Traduzir atributos title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation) el.title = translation;
        });
        
        // Traduzir options de selects
        document.querySelectorAll('select[data-i18n-options]').forEach(select => {
            const key = select.getAttribute('data-i18n-options');
            const options = this.t(key);
            if (typeof options === 'object') {
                select.querySelectorAll('option').forEach(opt => {
                    const optKey = opt.getAttribute('data-i18n-value');
                    if (optKey && options[optKey]) {
                        opt.textContent = options[optKey];
                    }
                });
            }
        });
        
        // Atualizar direção do texto para RTL (se necessário)
        const isRTL = this.currentLocale === 'ar-SA' || this.currentLocale === 'he-IL';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        
        // Notificar listeners
        this.listeners.forEach(fn => fn(this.currentLocale, this.translations));
    },
    
    // Mudar idioma
    async setLocale(locale) {
        if (locale === this.currentLocale) return;
        await this.loadTranslations(locale);
        this.applyTranslations();
        this.updateSelector();
        
        // Recarregar artigos e estatísticas
        if (typeof loadArticles === 'function') {
            await loadArticles();
        }
    },
    
    // Configurar seletor
    setupSelector() {
        const selector = document.getElementById('languageSelector');
        if (!selector) return;
        
        selector.value = this.currentLocale;
        selector.addEventListener('change', (e) => {
            this.setLocale(e.target.value);
        });
        
        this.updateSelector();
    },
    
    updateSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) selector.value = this.currentLocale;
    },
    
    // Adicionar listener
    onLocaleChange(fn) {
        this.listeners.push(fn);
        return () => {
            const index = this.listeners.indexOf(fn);
            if (index !== -1) this.listeners.splice(index, 1);
        };
    },
    
    // Obter idioma atual
    getLocale() {
        return this.currentLocale;
    },
    
    // Formatar data
    formatDate(date, options = {}) {
        const validDate = safeToDate ? safeToDate(date) : new Date(date);
        if (!validDate || isNaN(validDate)) return '';
        
        const localeMap = {
            'pt-BR': 'pt-BR',
            'en-US': 'en-US',
            'es-ES': 'es-ES'
        };
        
        return validDate.toLocaleDateString(localeMap[this.currentLocale] || 'pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        });
    },
    
    // Formatar número
    formatNumber(num) {
        const localeMap = {
            'pt-BR': 'pt-BR',
            'en-US': 'en-US',
            'es-ES': 'es-ES'
        };
        return Number(num).toLocaleString(localeMap[this.currentLocale] || 'pt-BR');
    }
};

// ============================================
// FUNÇÃO AUXILIAR PARA TRADUÇÃO RÁPIDA
// ============================================
function __(key, params = {}) {
    return I18n.t(key, params);
}

// Exportar para uso global
window.I18n = I18n;
window.__ = __;

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', async function() {
    await I18n.init();
    console.log(`🌐 Idioma carregado: ${I18n.getLocale()}`);
});
