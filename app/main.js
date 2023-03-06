window.MonacoEditorWordSuggestion = class MonacoEditorWordSuggestion {
    language = 'javascript'
    monaco = window.monaco
    autoRegister = true
    disposeOther = true
    tokenPattern = new RegExp('([a-zA-Z]+)', 'g');
    baseTheme = 'vs-dark'
    themeName = 'word-suggest'
    provider = {
        color: undefined,
        hover: undefined,
        completion: undefined
    }
    rules = [
        {
            token: 'that',
            target: window.vue,
            foreground: 'e23aff',
            fontStyle: ''
        }
    ]
    documentCache = {
        ['that']: {
            label: 'that',
            documentation: '## that document'
        }
    }
    get defaultSuggestion() {
        return this.rules.map((rule) => {
            return {
                label: rule.token,
                kind: this.monaco.languages.CompletionItemKind.Keyword,
                insertText: rule.token
            }
        })
    }
    get targetMap() {
        var map = {}
        this.rules.forEach((r) => {
            map[r.token] = r.target
        })
        return map
    }
    get legend() {
        return {
            tokenTypes: this.tokens,
            tokenModifiers: []
        }
    }
    get tokens() {
        return this.rules.map(v => v.token)
    }
    get colorRules() {
        return this.rules.map(v => ({
            token: v.token,
            foreground: v.foreground,
            fontStyle: v.fontStyle
        }))
    }
    get startsWiths() {
        return this.rules.map(v => v.token + '.')
    }
    constructor(opt) {
        Object.assign(this, opt)
        if (this.autoRegister) {
            this.register()
        }
        if (this.disposeOther) {
            this.list.forEach(item => item.dispose())
        }
        this.list.push(this)
    }
    register(type) {
        if (type) {
            switch (type) {
                case 'hover': this.registerHover()
                    break;
                case 'completion': this.registerCompletionItem()
                    break;
                case 'color':
                    this.registerDocumentSemanticTokens()
                    this.defineTheme()
                    break;
            }
        } else {
            this.registerHover()
            this.registerCompletionItem()
            this.registerDocumentSemanticTokens()
            this.defineTheme()
        }
    }
    dispose(type) {
        if (type) {
            switch (type) {
                case 'hover': this.provider.hover && this.provider.hover.dispose()
                    break;
                case 'completion': this.provider.completion && this.provider.completion.dispose()
                    break;
                case 'color':
                    this.provider.color && this.provider.color.dispose()
                    break;
            }
        } else {
            this.provider.completion && this.provider.completion.dispose()
            this.provider.color && this.provider.color.dispose()
            this.provider.hover && this.provider.hover.dispose()
        }
    }
    getAllkeys(obj) {
        const keys = []
        let temp = obj
        while (temp) {
            keys.push.apply(keys, Object.getOwnPropertyNames(temp))
            keys.push.apply(keys, Object.getOwnPropertySymbols(temp))
            temp = Object.getPrototypeOf(temp)
        }

        return [...new Set(keys)]
    }
    async resolveWordHoverData(wordword) {
        return this.documentCache[wordword]
    }
    registerHover() {
        let { monaco, language } = this
        if (this.provider.hover) return
        this.provider.hover = monaco.languages.registerHoverProvider(language, {
            provideHover: async (model, position) => {
                try {
                    let pos = model.getWordAtPosition(position)
                    if (!pos) return 
                    var wordword = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: model.getWordAtPosition(position).endColumn
                    }).replace(/\t/g, ' ').trim();
                    if (wordword[wordword.length - 1] == '.') {
                        wordword = wordword.substring(wordword.lastIndexOf(' ') + 1, wordword.length)
                    }
                    let data = await this.resolveWordHoverData(wordword)
                    if (data) {
                        return {
                            contents: [
                                { value: `**${data.label}**` },
                                { value: '```javascript\n' + data.documentation + '\n```' }
                            ]
                        };
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        });
    }
    resolveRule(wordword) {
        return this.rules.find((rule) => {
            return wordword.startsWith(`${rule.token}.`)
        })
    }
    resolveObj(wordword, rule) {
        try {
            var target = rule.target
            return eval(wordword.substring(0, wordword.length - 1).replace(rule.token, 'target'));
        } catch (e) {
            return undefined
        }
    }
    registerCompletionItem() {
        var { monaco, language } = this
        if (this.provider.completion) return
        this.provider.completion = monaco.languages.registerCompletionItemProvider(language, {
            triggerCharacters: '.',
            provideCompletionItems: async (model, position) => {
                var wordword = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                }).replace(/\t/g, ' ').trim();
                if (wordword[wordword.length - 1] == '.') {
                    wordword = wordword.substring(wordword.lastIndexOf(' ') + 1, wordword.length)
                }
                let rule = this.resolveRule(wordword)
                if (rule) {
                    try {
                        let obj = this.resolveObj(wordword, rule)
                        if (obj) {
                            let suggestions = this.getAllkeys(obj).filter(o => typeof o == 'string').sort((a, b) => a.indexOf('_')).map((k) => {
                                var res = {}
                                try {
                                    var res = {
                                        label: k,
                                        kind: typeof obj[k] === 'function' ? monaco.languages.CompletionItemKind.Function : monaco.languages.CompletionItemKind.Property,
                                        documentation: typeof obj[k] === 'function' ? obj[k].toString() : k,
                                        insertText: k
                                    }
                                    this.documentCache[wordword + k] = JSON.parse(JSON.stringify(res))
                                } catch (e) {
                                    res = {
                                        label: k,
                                        kind: monaco.languages.CompletionItemKind.Property,
                                        documentation: k,
                                        insertText: k
                                    }
                                }
                                return res
                            });
                            return { suggestions }
                        }

                    } catch (e) {
                        console.error(e)
                    }
                }
                return {
                    suggestions: this.defaultSuggestion
                };
            }
        });
    }
    defineTheme() {
        this.monaco.editor.defineTheme(this.themeName, {
            base: this.baseTheme,
            inherit: true,
            colors: {},
            rules: this.colorRules
        })
    }
    getType(type) {
        return this.legend.tokenTypes.indexOf(type);
    }
    registerDocumentSemanticTokens() {
        let { monaco, language, tokenPattern } = this
        if (this.provider.color) return
        this.provider.color = monaco.languages.registerDocumentSemanticTokensProvider(language, {
            getLegend: () => {
                return this.legend;
            },
            provideDocumentSemanticTokens: (model, lastResultId, token) => {
                const lines = model.getLinesContent();

                const data = [];

                let prevLine = 0;
                let prevChar = 0;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    for (let match = null; (match = tokenPattern.exec(line));) {
                        // translate token and modifiers to number representations
                        let type = this.getType(match[1]);
                        if (type === -1) {
                            continue;
                        }
                        let modifier = 0;

                        data.push(
                            // translate line to deltaLine
                            i - prevLine,
                            // for the same line, translate start to deltaStart
                            prevLine === i ? match.index - prevChar : match.index,
                            match[0].length,
                            type,
                            modifier
                        );

                        prevLine = i;
                        prevChar = match.index;
                    }
                }
                return {
                    data: new Uint32Array(data),
                    resultId: null
                };
            },
            releaseDocumentSemanticTokens: function (resultId) { }
        });
    }
}
MonacoEditorWordSuggestion.prototype.list = []

module.exports = MonacoEditorWordSuggestion
