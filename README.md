# mithril-markdown

Mithril markdown editor component: click on the HTML to open the markdown editor, edit the markdown, and close it again to render the HTML.

## Installation

Pull it from [npm](https://www.npmjs.com/package/mithril-markdown).

```bash
npm i mithril mithril-markdown
# Also install the typings if you use TypeScript
npm i --save-dev @types/mithril
```

## Playground

There is a small [playground](xxx) on [flems.io](https://flems.io).

## Usage example

```ts
import m from 'mithril';
import { MarkdownEditor } from 'mithril-markdown';

...

  m(MarkdownEditor, {
    preview: 500,
    markdown: state.markdown,
    onchange: (markdown) => {
      console.log(markdown);
    },
  }),

```

## Build instructions

Using `pnpm` (`npm i -g pnpm`), run the following commands:

```bash
pnpm m i
npm start
```

## SVG instructions

I've used [Inkscape](http://inkscape.org) to create the button icons and the CLI `svgo` (`npm i -g svgo`) tool to clean them up (`svgo -f assets`) and convert them to base64 (e.g. `svgo src\assets\strikethrough.svg --datauri=base64`). After the base64 encoding, I've manually converted them to a TypeScript constant, so I could include them easily as image source.