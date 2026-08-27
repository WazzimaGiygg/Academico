// ============================================
// FUNÇÕES AUXILIARES (com suporte a i18n)
// ============================================

function getTypeLabel(type) {
    // Verificar se I18n está disponível
    if (typeof I18n !== 'undefined' && I18n.getTypeLabel) {
        return I18n.getTypeLabel(type);
    }
    // Fallback estático
    const types = {
        'cientifico': 'Artigo Científico',
        'revisao': 'Revisão Bibliográfica',
        'monografia': 'Monografia',
        'dissertacao': 'Dissertação',
        'tese': 'Tese',
        'noticia': 'Notícia',
        'tutorial': 'Tutorial',
        'editorial': 'Editorial',
        'opiniao': 'Opinião',
        'entrevista': 'Entrevista'
    };
    return types[type] || type;
}

function getLanguageLabel(langCode) {
    if (typeof I18n !== 'undefined' && I18n.getLanguageLabel) {
        return I18n.getLanguageLabel(langCode);
    }
    const languages = {
        'pt-BR': 'Português',
        'en-US': 'English',
        'es-ES': 'Español'
    };
    return languages[langCode] || langCode;
}

function formatDate(date) {
    if (!date) {
        if (typeof I18n !== 'undefined' && I18n.t) {
            return I18n.t('days.now') || 'Data desconhecida';
        }
        return 'Data desconhecida';
    }
    if (typeof I18n !== 'undefined' && I18n.formatDate) {
        return I18n.formatDate(date) || 'Data inválida';
    }
    // Fallback
    let validDate = date;
    if (date.toDate) validDate = date.toDate();
    else if (date.seconds) validDate = new Date(date.seconds * 1000);
    else validDate = new Date(date);
    if (!(validDate instanceof Date) || isNaN(validDate)) return 'Data inválida';
    return validDate.toLocaleDateString('pt-BR');
}

function formatNumber(num) {
    if (typeof I18n !== 'undefined' && I18n.formatNumber) {
        return I18n.formatNumber(num);
    }
    return Number(num).toLocaleString('pt-BR');
}
