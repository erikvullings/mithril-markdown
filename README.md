# mithril-markdown

Mithril markdown editor component: click on the HTML to open the markdown editor, edit the markdown, and close it again to render the HTML. Depends on [marked](https://www.npmjs.com/package/marked) for markdown processing.

## Installation

Get it from [npm](https://www.npmjs.com/package/mithril-markdown).

```bash
npm i mithril mithril-markdown
# If you use TypeScript, also install the typings
npm i --save-dev @types/mithril
```

## Playground

There is a small [playground](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIB08wgDTlgCcB7KKNAbQAZcqBdfAMwEsYdULQA7AQwFsIaTNjwhYxLoklDmfAA7FC8AATBlhCFyQRCygL7LGJPsoDkYKLKTEA7lwC0AKzCmA3AB0u4rmBUBZAE8-HkIAa2s7AFEkZnhFZQBeZWCwiK5o2MUMFPDbdJi4wg8uT29fZQAFHgBzCETlAAoASkSAPlVPZWUYFT4Q3Lt6gANPAGJlAGEACx45REJPMfGAZTh4ZglFrgAqbYmAGQBJCYBpZQB5ADlkyOUAFXPlZbuAQQAlO+VIgBFDu8PLgBxXZbABqzDAsWUFEBxGI1RgdAaU3g8DkYFQAHpMTZcRhqnCERAMOI+E0MFs7lMIcoaTxlGApooVJYuMStpdbMp4NSwLS+fSAG46ALdCTVbrMNm4WmSTTaJDc4jKGyEWay7lTOrITKEDDKABCAFcVDZYkyTZK2QAjDQ8UJgGVgZU2LVcFV1OQ6RiKEz0vhGqDrVl1HgIDZcGVQxnEQOK611eB2xCKngChlSolW9klLhUml0hlMpSS3wU9JhqbZ-kMiByEI8FPKa2i+kh20Qe3lvyB4NS0PhiR8mNx5ue72+5DKCTKTuwKsh8ueZZMuRyTOl+CoTz2ZSHRAmACMO73B+UACZPENip11BB4EbCO7gLeuoLmBAbKhGi0Eu0X+6XRARoD5PsofANIEORpBkhQymo9aEJA34aFoOgyn0qR5DKcgaO+n7fgALFQVD6E0r76Lgt56J4NG5nwGB8LGkgNNYsBGgIkgYNaxBIAEMpVLUTSiJAMCDj4QgAMySag54AOwgHoDAgKyDqUNw-CCOgfDmoQrCiI+5DoCiaIYtiRpcHIoTVCSxB8JiOk8npUAAALnhgVAYIRDm6awjFShgziiPAARekIYBEMwcyKbgGkCEIjlTM59iYQMXAGYQRkgCZ6JYpiFlWTZpI+U5rApf0aQuZ5kkeZiMS+CVSVlalaSBTg+AhWF6ARXp0X4KJawRuwICHgArLJACcABsVCjYpdB6EAA) on [flems.io](https://flems.io).

## Usage example

```ts
import m from 'mithril';
import { render } from 'slimdown-js'; // To render the markdown to HTML
// import marked from 'marked'; // Alternative markdown renderer, which uses more code but also has more features.
import { MarkdownEditor } from 'mithril-markdown';

...

  m(MarkdownEditor, {
    parse: render,
    // parse: marked,
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

I've used [Inkscape](http://inkscape.org) to create the button icons and the CLI [svgo](https://www.npmjs.com/package/svgo) (`npm i -g svgo`) tool to clean them up (`svgo -f assets`) and convert them to base64 (e.g. `svgo src\assets\strikethrough.svg --datauri=base64`). After the base64 encoding, I've manually converted them to a TypeScript constant, so I could include them easily as image source.
