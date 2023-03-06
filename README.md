# 一个简单的MONACO编辑器的辅助工具
------
因为偶然用到monaco编辑器，需要对某个固定的关键字，进行推断代码提示， 所以做了这个东西，方便自己以后使用
虽然可以用用monaco加载d.ts增强代码推断能力，但是需要学习ts，所以就做了一个简单的关键字映射到变量进行代码提示
简单来说，配置好关键字和变量的关系，输入关键字时进行属性提示

### [在线演示demo](https://rzl.github.io/monaco-editor-word-suggestion/)

### 代码在dev分支

### 调试测试
1.cnpm install
2.cnpm run dev

### 编译
1.cnpm install
1.cnpm run build

### 其他项目引用
1.cnpm install monaco-editor-word-suggestion -S

将that映射到bbb变量进行方法属性提示（页面中输入that即可体验）

关键字高亮需要开启semanticHighlighting.enabled 及新的主题名字

```js
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditorWordSuggestion  from 'monaco-editor-word-suggestion'

var bbb = new Date()
var mws = new MonacoEditorWordSuggestion({
  monaco: window.monaco,
  rules: [
    {
      token: 'that',
      target: bbb,
      foreground: 'e23aff',
      fontStyle: ''
    }
  ]
})
var editor = monaco.editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
  theme: mws.themeName,
  'semanticHighlighting.enabled': true
});
```

### 使用方法，初始化
将that映射到bbb变量进行方法属性提示（页面中输入that即可体验）

关键字高亮需要开启semanticHighlighting.enabled 及新的主题名字
```html
<!DOCTYPE html>
<html>
	<head>
		<title>monaco-editor-word-suggestion</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	</head>
	<body>
		<h2>monaco-editor-word-suggestion</h2>
		<div id="container" style="width: 800px; height: 600px; border: 1px solid grey"></div>

		<script src="./dist/monaco-editor-word-suggestion.js"></script>
		<!-- OR ANY OTHER AMD LOADER HERE INSTEAD OF loader.js -->
		<script src="./public/release/min/vs/loader.js"></script>
		<script>
			require.config({ paths: { vs: './public/release/min/vs' } });

			require(['vs/editor/editor.main'], function () {
				var bbb = new Date()
				var mws = new MonacoEditorWordSuggestion({
					monaco: window.monaco,
					rules: [
						{
							token: 'that',
							target: bbb,
							foreground: 'e23aff',
							fontStyle: ''
						}
					]
				})
				var editor = monaco.editor.create(document.getElementById('container'), {
					value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
					language: 'javascript',
					theme: mws.themeName,
					'semanticHighlighting.enabled': true
				});
			});
		</script>
	</body>
</html>

    
```
