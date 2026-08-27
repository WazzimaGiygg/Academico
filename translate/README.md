# 🌐 Sistema de Tradução - Biblioteca Científica WazzimaGiygg

## Estrutura
/translate/
├── index.html # Página principal com seletor de idioma
├── i18n.js # Sistema de tradução
├── locales/ # Arquivos de tradução
│ ├── pt-BR.json # Português Brasileiro
│ ├── en-US.json # Inglês Americano
│ └── es-ES.json # Espanhol
└── README.md # Este arquivo



## Idiomas Suportados

| Código | Idioma | Status |
|--------|--------|--------|
| pt-BR  | Português Brasileiro | ✅ Completo |
| en-US  | Inglês Americano | ✅ Completo |
| es-ES  | Espanhol | ✅ Completo |

## Como Funciona

1. **Detecção Automática**: O sistema detecta o idioma do navegador
2. **Persistência**: A preferência é salva no `localStorage`
3. **Tradução DOM**: Elementos com `data-i18n` são traduzidos automaticamente
4. **Atualização Dinâmica**: Ao trocar de idioma, todo o conteúdo é atualizado

## Uso no HTML

### Textos Estáticos
```html
<h1 data-i18n="banner.title">Texto padrão</h1>
