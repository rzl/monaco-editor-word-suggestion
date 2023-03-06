!function(g,I){"object"==typeof exports&&"object"==typeof module?module.exports=I():"function"==typeof define&&define.amd?define([],I):"object"==typeof exports?exports["monaco-editor-word-suggestion"]=I():g["monaco-editor-word-suggestion"]=I()}(self,(()=>(()=>{var __webpack_modules__={975:module=>{eval("window.MonacoEditorWordSuggestion = class MonacoEditorWordSuggestion {\r\n    language = 'javascript'\r\n    monaco = window.monaco\r\n    autoRegister = true\r\n    disposeOther = true\r\n    tokenPattern = new RegExp('([a-zA-Z]+)', 'g');\r\n    baseTheme = 'vs-dark'\r\n    themeName = 'word-suggest'\r\n    provider = {\r\n        color: undefined,\r\n        hover: undefined,\r\n        completion: undefined\r\n    }\r\n    rules = [\r\n        {\r\n            token: 'that',\r\n            target: window.vue,\r\n            foreground: 'e23aff',\r\n            fontStyle: ''\r\n        }\r\n    ]\r\n    documentCache = {\r\n        ['that']: {\r\n            label: 'that',\r\n            documentation: '## that document'\r\n        }\r\n    }\r\n    get defaultSuggestion() {\r\n        return this.rules.map((rule) => {\r\n            return {\r\n                label: rule.token,\r\n                kind: this.monaco.languages.CompletionItemKind.Keyword,\r\n                insertText: rule.token\r\n            }\r\n        })\r\n    }\r\n    get targetMap() {\r\n        var map = {}\r\n        this.rules.forEach((r) => {\r\n            map[r.token] = r.target\r\n        })\r\n        return map\r\n    }\r\n    get legend() {\r\n        return {\r\n            tokenTypes: this.tokens,\r\n            tokenModifiers: []\r\n        }\r\n    }\r\n    get tokens() {\r\n        return this.rules.map(v => v.token)\r\n    }\r\n    get colorRules() {\r\n        return this.rules.map(v => ({\r\n            token: v.token,\r\n            foreground: v.foreground,\r\n            fontStyle: v.fontStyle\r\n        }))\r\n    }\r\n    get startsWiths() {\r\n        return this.rules.map(v => v.token + '.')\r\n    }\r\n    constructor(opt) {\r\n        Object.assign(this, opt)\r\n        if (this.autoRegister) {\r\n            this.register()\r\n        }\r\n        if (this.disposeOther) {\r\n            this.list.forEach(item => item.dispose())\r\n        }\r\n        this.list.push(this)\r\n    }\r\n    register(type) {\r\n        if (type) {\r\n            switch (type) {\r\n                case 'hover': this.registerHover()\r\n                    break;\r\n                case 'completion': this.registerCompletionItem()\r\n                    break;\r\n                case 'color':\r\n                    this.registerDocumentSemanticTokens()\r\n                    this.defineTheme()\r\n                    break;\r\n            }\r\n        } else {\r\n            this.registerHover()\r\n            this.registerCompletionItem()\r\n            this.registerDocumentSemanticTokens()\r\n            this.defineTheme()\r\n        }\r\n    }\r\n    dispose(type) {\r\n        if (type) {\r\n            switch (type) {\r\n                case 'hover': this.provider.hover && this.provider.hover.dispose()\r\n                    break;\r\n                case 'completion': this.provider.completion && this.provider.completion.dispose()\r\n                    break;\r\n                case 'color':\r\n                    this.provider.color && this.provider.color.dispose()\r\n                    break;\r\n            }\r\n        } else {\r\n            this.provider.completion && this.provider.completion.dispose()\r\n            this.provider.color && this.provider.color.dispose()\r\n            this.provider.hover && this.provider.hover.dispose()\r\n        }\r\n    }\r\n    getAllkeys(obj) {\r\n        const keys = []\r\n        let temp = obj\r\n        while (temp) {\r\n            keys.push.apply(keys, Object.getOwnPropertyNames(temp))\r\n            keys.push.apply(keys, Object.getOwnPropertySymbols(temp))\r\n            temp = Object.getPrototypeOf(temp)\r\n        }\r\n\r\n        return [...new Set(keys)]\r\n    }\r\n    async resolveWordHoverData(wordword) {\r\n        return this.documentCache[wordword]\r\n    }\r\n    registerHover() {\r\n        let { monaco, language } = this\r\n        if (this.provider.hover) return\r\n        this.provider.hover = monaco.languages.registerHoverProvider(language, {\r\n            provideHover: async (model, position) => {\r\n                try {\r\n                    let pos = model.getWordAtPosition(position)\r\n                    if (!pos) return \r\n                    var wordword = model.getValueInRange({\r\n                        startLineNumber: position.lineNumber,\r\n                        startColumn: 1,\r\n                        endLineNumber: position.lineNumber,\r\n                        endColumn: model.getWordAtPosition(position).endColumn\r\n                    }).replace(/\\t/g, ' ').trim();\r\n                    if (wordword[wordword.length - 1] == '.') {\r\n                        wordword = wordword.substring(wordword.lastIndexOf(' ') + 1, wordword.length)\r\n                    }\r\n                    let data = await this.resolveWordHoverData(wordword)\r\n                    if (data) {\r\n                        return {\r\n                            contents: [\r\n                                { value: `**${data.label}**` },\r\n                                { value: '```javascript\\n' + data.documentation + '\\n```' }\r\n                            ]\r\n                        };\r\n                    }\r\n                } catch (e) {\r\n                    console.error(e)\r\n                }\r\n            }\r\n        });\r\n    }\r\n    resolveRule(wordword) {\r\n        return this.rules.find((rule) => {\r\n            return wordword.startsWith(`${rule.token}.`)\r\n        })\r\n    }\r\n    resolveObj(wordword, rule) {\r\n        try {\r\n            var target = rule.target\r\n            return eval(wordword.substring(0, wordword.length - 1).replace(rule.token, 'target'));\r\n        } catch (e) {\r\n            return undefined\r\n        }\r\n    }\r\n    registerCompletionItem() {\r\n        var { monaco, language } = this\r\n        if (this.provider.completion) return\r\n        this.provider.completion = monaco.languages.registerCompletionItemProvider(language, {\r\n            triggerCharacters: '.',\r\n            provideCompletionItems: async (model, position) => {\r\n                var wordword = model.getValueInRange({\r\n                    startLineNumber: position.lineNumber,\r\n                    startColumn: 1,\r\n                    endLineNumber: position.lineNumber,\r\n                    endColumn: position.column\r\n                }).replace(/\\t/g, ' ').trim();\r\n                if (wordword[wordword.length - 1] == '.') {\r\n                    wordword = wordword.substring(wordword.lastIndexOf(' ') + 1, wordword.length)\r\n                }\r\n                let rule = this.resolveRule(wordword)\r\n                if (rule) {\r\n                    try {\r\n                        let obj = this.resolveObj(wordword, rule)\r\n                        if (obj) {\r\n                            let suggestions = this.getAllkeys(obj).filter(o => typeof o == 'string').sort((a, b) => a.indexOf('_')).map((k) => {\r\n                                var res = {}\r\n                                try {\r\n                                    var res = {\r\n                                        label: k,\r\n                                        kind: typeof obj[k] === 'function' ? monaco.languages.CompletionItemKind.Function : monaco.languages.CompletionItemKind.Property,\r\n                                        documentation: typeof obj[k] === 'function' ? obj[k].toString() : k,\r\n                                        insertText: k\r\n                                    }\r\n                                    this.documentCache[wordword + k] = JSON.parse(JSON.stringify(res))\r\n                                } catch (e) {\r\n                                    res = {\r\n                                        label: k,\r\n                                        kind: monaco.languages.CompletionItemKind.Property,\r\n                                        documentation: k,\r\n                                        insertText: k\r\n                                    }\r\n                                }\r\n                                return res\r\n                            });\r\n                            return { suggestions }\r\n                        }\r\n\r\n                    } catch (e) {\r\n                        console.error(e)\r\n                    }\r\n                }\r\n                return {\r\n                    suggestions: this.defaultSuggestion\r\n                };\r\n            }\r\n        });\r\n    }\r\n    defineTheme() {\r\n        this.monaco.editor.defineTheme(this.themeName, {\r\n            base: this.baseTheme,\r\n            inherit: true,\r\n            colors: {},\r\n            rules: this.colorRules\r\n        })\r\n    }\r\n    getType(type) {\r\n        return this.legend.tokenTypes.indexOf(type);\r\n    }\r\n    registerDocumentSemanticTokens() {\r\n        let { monaco, language, tokenPattern } = this\r\n        if (this.provider.color) return\r\n        this.provider.color = monaco.languages.registerDocumentSemanticTokensProvider(language, {\r\n            getLegend: () => {\r\n                return this.legend;\r\n            },\r\n            provideDocumentSemanticTokens: (model, lastResultId, token) => {\r\n                const lines = model.getLinesContent();\r\n\r\n                const data = [];\r\n\r\n                let prevLine = 0;\r\n                let prevChar = 0;\r\n\r\n                for (let i = 0; i < lines.length; i++) {\r\n                    const line = lines[i];\r\n\r\n                    for (let match = null; (match = tokenPattern.exec(line));) {\r\n                        // translate token and modifiers to number representations\r\n                        let type = this.getType(match[1]);\r\n                        if (type === -1) {\r\n                            continue;\r\n                        }\r\n                        let modifier = 0;\r\n\r\n                        data.push(\r\n                            // translate line to deltaLine\r\n                            i - prevLine,\r\n                            // for the same line, translate start to deltaStart\r\n                            prevLine === i ? match.index - prevChar : match.index,\r\n                            match[0].length,\r\n                            type,\r\n                            modifier\r\n                        );\r\n\r\n                        prevLine = i;\r\n                        prevChar = match.index;\r\n                    }\r\n                }\r\n                return {\r\n                    data: new Uint32Array(data),\r\n                    resultId: null\r\n                };\r\n            },\r\n            releaseDocumentSemanticTokens: function (resultId) { }\r\n        });\r\n    }\r\n}\r\nMonacoEditorWordSuggestion.prototype.list = []\r\n\r\nmodule.exports = MonacoEditorWordSuggestion\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOTc1LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1CQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFlBQVksV0FBVyxLQUFLO0FBQzlELGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxXQUFXO0FBQ3JELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxtQkFBbUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHFDQUFxQztBQUNyQztBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsaUNBQWlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQSwyQ0FBMkMsa0NBQWtDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb25hY28tZWRpdG9yLXdvcmQtc3VnZ2VzdGlvbi8uL2FwcC9tYWluLmpzP2YxNjEiXSwic291cmNlc0NvbnRlbnQiOlsid2luZG93Lk1vbmFjb0VkaXRvcldvcmRTdWdnZXN0aW9uID0gY2xhc3MgTW9uYWNvRWRpdG9yV29yZFN1Z2dlc3Rpb24ge1xyXG4gICAgbGFuZ3VhZ2UgPSAnamF2YXNjcmlwdCdcclxuICAgIG1vbmFjbyA9IHdpbmRvdy5tb25hY29cclxuICAgIGF1dG9SZWdpc3RlciA9IHRydWVcclxuICAgIGRpc3Bvc2VPdGhlciA9IHRydWVcclxuICAgIHRva2VuUGF0dGVybiA9IG5ldyBSZWdFeHAoJyhbYS16QS1aXSspJywgJ2cnKTtcclxuICAgIGJhc2VUaGVtZSA9ICd2cy1kYXJrJ1xyXG4gICAgdGhlbWVOYW1lID0gJ3dvcmQtc3VnZ2VzdCdcclxuICAgIHByb3ZpZGVyID0ge1xyXG4gICAgICAgIGNvbG9yOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaG92ZXI6IHVuZGVmaW5lZCxcclxuICAgICAgICBjb21wbGV0aW9uOiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIHJ1bGVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdG9rZW46ICd0aGF0JyxcclxuICAgICAgICAgICAgdGFyZ2V0OiB3aW5kb3cudnVlLFxyXG4gICAgICAgICAgICBmb3JlZ3JvdW5kOiAnZTIzYWZmJyxcclxuICAgICAgICAgICAgZm9udFN0eWxlOiAnJ1xyXG4gICAgICAgIH1cclxuICAgIF1cclxuICAgIGRvY3VtZW50Q2FjaGUgPSB7XHJcbiAgICAgICAgWyd0aGF0J106IHtcclxuICAgICAgICAgICAgbGFiZWw6ICd0aGF0JyxcclxuICAgICAgICAgICAgZG9jdW1lbnRhdGlvbjogJyMjIHRoYXQgZG9jdW1lbnQnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0IGRlZmF1bHRTdWdnZXN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVzLm1hcCgocnVsZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHJ1bGUudG9rZW4sXHJcbiAgICAgICAgICAgICAgICBraW5kOiB0aGlzLm1vbmFjby5sYW5ndWFnZXMuQ29tcGxldGlvbkl0ZW1LaW5kLktleXdvcmQsXHJcbiAgICAgICAgICAgICAgICBpbnNlcnRUZXh0OiBydWxlLnRva2VuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgZ2V0IHRhcmdldE1hcCgpIHtcclxuICAgICAgICB2YXIgbWFwID0ge31cclxuICAgICAgICB0aGlzLnJ1bGVzLmZvckVhY2goKHIpID0+IHtcclxuICAgICAgICAgICAgbWFwW3IudG9rZW5dID0gci50YXJnZXRcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBtYXBcclxuICAgIH1cclxuICAgIGdldCBsZWdlbmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9rZW5UeXBlczogdGhpcy50b2tlbnMsXHJcbiAgICAgICAgICAgIHRva2VuTW9kaWZpZXJzOiBbXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldCB0b2tlbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZXMubWFwKHYgPT4gdi50b2tlbilcclxuICAgIH1cclxuICAgIGdldCBjb2xvclJ1bGVzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVzLm1hcCh2ID0+ICh7XHJcbiAgICAgICAgICAgIHRva2VuOiB2LnRva2VuLFxyXG4gICAgICAgICAgICBmb3JlZ3JvdW5kOiB2LmZvcmVncm91bmQsXHJcbiAgICAgICAgICAgIGZvbnRTdHlsZTogdi5mb250U3R5bGVcclxuICAgICAgICB9KSlcclxuICAgIH1cclxuICAgIGdldCBzdGFydHNXaXRocygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ydWxlcy5tYXAodiA9PiB2LnRva2VuICsgJy4nKVxyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3Iob3B0KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHQpXHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b1JlZ2lzdGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNwb3NlT3RoZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5saXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmRpc3Bvc2UoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2godGhpcylcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyKHR5cGUpIHtcclxuICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdmVyJzogdGhpcy5yZWdpc3RlckhvdmVyKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbXBsZXRpb24nOiB0aGlzLnJlZ2lzdGVyQ29tcGxldGlvbkl0ZW0oKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29sb3InOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJEb2N1bWVudFNlbWFudGljVG9rZW5zKClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVRoZW1lKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJIb3ZlcigpXHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDb21wbGV0aW9uSXRlbSgpXHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJEb2N1bWVudFNlbWFudGljVG9rZW5zKClcclxuICAgICAgICAgICAgdGhpcy5kZWZpbmVUaGVtZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGlzcG9zZSh0eXBlKSB7XHJcbiAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdob3Zlcic6IHRoaXMucHJvdmlkZXIuaG92ZXIgJiYgdGhpcy5wcm92aWRlci5ob3Zlci5kaXNwb3NlKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbXBsZXRpb24nOiB0aGlzLnByb3ZpZGVyLmNvbXBsZXRpb24gJiYgdGhpcy5wcm92aWRlci5jb21wbGV0aW9uLmRpc3Bvc2UoKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29sb3InOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvdmlkZXIuY29sb3IgJiYgdGhpcy5wcm92aWRlci5jb2xvci5kaXNwb3NlKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXIuY29tcGxldGlvbiAmJiB0aGlzLnByb3ZpZGVyLmNvbXBsZXRpb24uZGlzcG9zZSgpXHJcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXIuY29sb3IgJiYgdGhpcy5wcm92aWRlci5jb2xvci5kaXNwb3NlKClcclxuICAgICAgICAgICAgdGhpcy5wcm92aWRlci5ob3ZlciAmJiB0aGlzLnByb3ZpZGVyLmhvdmVyLmRpc3Bvc2UoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldEFsbGtleXMob2JqKSB7XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IFtdXHJcbiAgICAgICAgbGV0IHRlbXAgPSBvYmpcclxuICAgICAgICB3aGlsZSAodGVtcCkge1xyXG4gICAgICAgICAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVtcCkpXHJcbiAgICAgICAgICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRlbXApKVxyXG4gICAgICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gWy4uLm5ldyBTZXQoa2V5cyldXHJcbiAgICB9XHJcbiAgICBhc3luYyByZXNvbHZlV29yZEhvdmVyRGF0YSh3b3Jkd29yZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50Q2FjaGVbd29yZHdvcmRdXHJcbiAgICB9XHJcbiAgICByZWdpc3RlckhvdmVyKCkge1xyXG4gICAgICAgIGxldCB7IG1vbmFjbywgbGFuZ3VhZ2UgfSA9IHRoaXNcclxuICAgICAgICBpZiAodGhpcy5wcm92aWRlci5ob3ZlcikgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5wcm92aWRlci5ob3ZlciA9IG1vbmFjby5sYW5ndWFnZXMucmVnaXN0ZXJIb3ZlclByb3ZpZGVyKGxhbmd1YWdlLCB7XHJcbiAgICAgICAgICAgIHByb3ZpZGVIb3ZlcjogYXN5bmMgKG1vZGVsLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9zID0gbW9kZWwuZ2V0V29yZEF0UG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwb3MpIHJldHVybiBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHdvcmQgPSBtb2RlbC5nZXRWYWx1ZUluUmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydExpbmVOdW1iZXI6IHBvc2l0aW9uLmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRMaW5lTnVtYmVyOiBwb3NpdGlvbi5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW46IG1vZGVsLmdldFdvcmRBdFBvc2l0aW9uKHBvc2l0aW9uKS5lbmRDb2x1bW5cclxuICAgICAgICAgICAgICAgICAgICB9KS5yZXBsYWNlKC9cXHQvZywgJyAnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmR3b3JkW3dvcmR3b3JkLmxlbmd0aCAtIDFdID09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3Jkd29yZCA9IHdvcmR3b3JkLnN1YnN0cmluZyh3b3Jkd29yZC5sYXN0SW5kZXhPZignICcpICsgMSwgd29yZHdvcmQubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMucmVzb2x2ZVdvcmRIb3ZlckRhdGEod29yZHdvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogYCoqJHtkYXRhLmxhYmVsfSoqYCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsdWU6ICdgYGBqYXZhc2NyaXB0XFxuJyArIGRhdGEuZG9jdW1lbnRhdGlvbiArICdcXG5gYGAnIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXNvbHZlUnVsZSh3b3Jkd29yZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVzLmZpbmQoKHJ1bGUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHdvcmR3b3JkLnN0YXJ0c1dpdGgoYCR7cnVsZS50b2tlbn0uYClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmVzb2x2ZU9iaih3b3Jkd29yZCwgcnVsZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBydWxlLnRhcmdldFxyXG4gICAgICAgICAgICByZXR1cm4gZXZhbCh3b3Jkd29yZC5zdWJzdHJpbmcoMCwgd29yZHdvcmQubGVuZ3RoIC0gMSkucmVwbGFjZShydWxlLnRva2VuLCAndGFyZ2V0JykpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlZ2lzdGVyQ29tcGxldGlvbkl0ZW0oKSB7XHJcbiAgICAgICAgdmFyIHsgbW9uYWNvLCBsYW5ndWFnZSB9ID0gdGhpc1xyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVyLmNvbXBsZXRpb24pIHJldHVyblxyXG4gICAgICAgIHRoaXMucHJvdmlkZXIuY29tcGxldGlvbiA9IG1vbmFjby5sYW5ndWFnZXMucmVnaXN0ZXJDb21wbGV0aW9uSXRlbVByb3ZpZGVyKGxhbmd1YWdlLCB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJDaGFyYWN0ZXJzOiAnLicsXHJcbiAgICAgICAgICAgIHByb3ZpZGVDb21wbGV0aW9uSXRlbXM6IGFzeW5jIChtb2RlbCwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB3b3Jkd29yZCA9IG1vZGVsLmdldFZhbHVlSW5SYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRMaW5lTnVtYmVyOiBwb3NpdGlvbi5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZExpbmVOdW1iZXI6IHBvc2l0aW9uLmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kQ29sdW1uOiBwb3NpdGlvbi5jb2x1bW5cclxuICAgICAgICAgICAgICAgIH0pLnJlcGxhY2UoL1xcdC9nLCAnICcpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICh3b3Jkd29yZFt3b3Jkd29yZC5sZW5ndGggLSAxXSA9PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3Jkd29yZCA9IHdvcmR3b3JkLnN1YnN0cmluZyh3b3Jkd29yZC5sYXN0SW5kZXhPZignICcpICsgMSwgd29yZHdvcmQubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJ1bGUgPSB0aGlzLnJlc29sdmVSdWxlKHdvcmR3b3JkKVxyXG4gICAgICAgICAgICAgICAgaWYgKHJ1bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5yZXNvbHZlT2JqKHdvcmR3b3JkLCBydWxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3VnZ2VzdGlvbnMgPSB0aGlzLmdldEFsbGtleXMob2JqKS5maWx0ZXIobyA9PiB0eXBlb2YgbyA9PSAnc3RyaW5nJykuc29ydCgoYSwgYikgPT4gYS5pbmRleE9mKCdfJykpLm1hcCgoaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IHR5cGVvZiBvYmpba10gPT09ICdmdW5jdGlvbicgPyBtb25hY28ubGFuZ3VhZ2VzLkNvbXBsZXRpb25JdGVtS2luZC5GdW5jdGlvbiA6IG1vbmFjby5sYW5ndWFnZXMuQ29tcGxldGlvbkl0ZW1LaW5kLlByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRhdGlvbjogdHlwZW9mIG9ialtrXSA9PT0gJ2Z1bmN0aW9uJyA/IG9ialtrXS50b1N0cmluZygpIDogayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFRleHQ6IGtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2FjaGVbd29yZHdvcmQgKyBrXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogbW9uYWNvLmxhbmd1YWdlcy5Db21wbGV0aW9uSXRlbUtpbmQuUHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudGF0aW9uOiBrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0VGV4dDoga1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VnZ2VzdGlvbnMgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnM6IHRoaXMuZGVmYXVsdFN1Z2dlc3Rpb25cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRlZmluZVRoZW1lKCkge1xyXG4gICAgICAgIHRoaXMubW9uYWNvLmVkaXRvci5kZWZpbmVUaGVtZSh0aGlzLnRoZW1lTmFtZSwge1xyXG4gICAgICAgICAgICBiYXNlOiB0aGlzLmJhc2VUaGVtZSxcclxuICAgICAgICAgICAgaW5oZXJpdDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3JzOiB7fSxcclxuICAgICAgICAgICAgcnVsZXM6IHRoaXMuY29sb3JSdWxlc1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBnZXRUeXBlKHR5cGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmQudG9rZW5UeXBlcy5pbmRleE9mKHR5cGUpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJEb2N1bWVudFNlbWFudGljVG9rZW5zKCkge1xyXG4gICAgICAgIGxldCB7IG1vbmFjbywgbGFuZ3VhZ2UsIHRva2VuUGF0dGVybiB9ID0gdGhpc1xyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVyLmNvbG9yKSByZXR1cm5cclxuICAgICAgICB0aGlzLnByb3ZpZGVyLmNvbG9yID0gbW9uYWNvLmxhbmd1YWdlcy5yZWdpc3RlckRvY3VtZW50U2VtYW50aWNUb2tlbnNQcm92aWRlcihsYW5ndWFnZSwge1xyXG4gICAgICAgICAgICBnZXRMZWdlbmQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvdmlkZURvY3VtZW50U2VtYW50aWNUb2tlbnM6IChtb2RlbCwgbGFzdFJlc3VsdElkLCB0b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBtb2RlbC5nZXRMaW5lc0NvbnRlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZMaW5lID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBwcmV2Q2hhciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbWF0Y2ggPSBudWxsOyAobWF0Y2ggPSB0b2tlblBhdHRlcm4uZXhlYyhsaW5lKSk7KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0b2tlbiBhbmQgbW9kaWZpZXJzIHRvIG51bWJlciByZXByZXNlbnRhdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldFR5cGUobWF0Y2hbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmFuc2xhdGUgbGluZSB0byBkZWx0YUxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLSBwcmV2TGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciB0aGUgc2FtZSBsaW5lLCB0cmFuc2xhdGUgc3RhcnQgdG8gZGVsdGFTdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkxpbmUgPT09IGkgPyBtYXRjaC5pbmRleCAtIHByZXZDaGFyIDogbWF0Y2guaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFswXS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZMaW5lID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNoYXIgPSBtYXRjaC5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ldyBVaW50MzJBcnJheShkYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRJZDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVsZWFzZURvY3VtZW50U2VtYW50aWNUb2tlbnM6IGZ1bmN0aW9uIChyZXN1bHRJZCkgeyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuTW9uYWNvRWRpdG9yV29yZFN1Z2dlc3Rpb24ucHJvdG90eXBlLmxpc3QgPSBbXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb25hY29FZGl0b3JXb3JkU3VnZ2VzdGlvblxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///975\n")}},__webpack_module_cache__={};function __webpack_require__(g){var I=__webpack_module_cache__[g];if(void 0!==I)return I.exports;var C=__webpack_module_cache__[g]={exports:{}};return __webpack_modules__[g](C,C.exports,__webpack_require__),C.exports}var __webpack_exports__=__webpack_require__(975);return __webpack_exports__})()));