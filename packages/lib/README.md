# mithril-markdown

Mithril markdown editor component: click on the HTML to open the markdown editor, edit the markdown, and close it again to render the HTML. Requires a markdown parser to convert the markdown text into HTML. A popular and fast markdown parser is [marked](https://www.npmjs.com/package/marked) for markdown processing. Alternatively, a smaller (and simpler) markdown parser that works too is [slimdown-js](https://www.npmjs.com/package/slimdown-js).

## Installation

Get it from [npm](https://www.npmjs.com/package/mithril-markdown).

```bash
npm i mithril mithril-markdown
# If you use TypeScript, also install the typings
npm i --save-dev @types/mithril
```

## Playground

There is a small [playground](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIB08wgDQgDMBLGHVAbVADsBDAWwjU2zxFgHsrEumi6AHdgCd4AAmCihEKkghDRAX1EEh7OqIDkYKHyTsA7lQC0AKzAaA3AB0qHKmDEBZAJ6OaQgNZ7DAUSRF4YVEAXlE3T28qPwDhDHCvAyj-QKFrKhs7B1EfAA96fhgQ0QAKAEoQgD5xG1FRTLEHGkQi4Bra0Tp3BMNUUQADGwBiUQBhAAsafkQhGyHhgGU4eCJOWaoAKnWRgBkASRGAaVEAeQA5MJ9RABVj0XmrgEEAJSvsgBFdq93TgHFNtYAakQwAFROQfux2ABzGAAXWKY3g8H4YFQAHo0fosRgoZCYRAMBw6KUMGsrmNgaJKTRRGAxsIxDoqAS1qcDKJ4BSwFTuTSAG5yZyiKCcKHCojM3BUrjSWRIDnsUT6ISTaUcsYQUTIGJCDCiABCAFcxPoAvTjeLmQAjKQ0DxgKVgRX6DVUJWa-hyAjCdQ0uiGqDLJmamgIFZUKWgunsAPyq2a+C2xDymi82kS-GWlnpKjkynU2n0kTihykqKhsZZnm0iD8dxNZCiK1CmnBm0QO1lxwBoMSkNhzjc6Oxpser0+xucLUVrNlmzzen8fgZkvwVA2IyiXaIdQARg3W53ogATDYBm7FG0pPBDUI3a0L7U+UQIPpemVKtVH+16uIOl1IkUIpGkQNJ2naa9bzdOhihceJImiFIpQkOshEgXopBkOQpU6CJEkUUo2lqBRcDaBQbHInM6AwTDZCEYo9FgQ0GC4DArXYJBnBw4pcnyGBSlKVhIBgAd7CYXdUAABiMCSAFZZJABRYXwJl7TQSgQFoBgmDoM0hBIVhbygJhEWRVEMUNKh+A8KFCTUNFdM5fSoAAAWPDBJIwAAWBy9JIDBdKoDAzFYeBnE9JgwFgfSpkU3BqHoRh0EcsZnKMXDuioQyhGM9BTJRdE0Us6zbKJXynJIdKAMSFzPIAZg8tF-AccrUsqjLImCnB8DCiL0CimL4EU2EFCAA) on [flems.io](https://flems.io).

## Usage example

```ts
import m from 'mithril';
import marked from 'marked';
// import { render } from 'slimdown-js';
import { MarkdownEditor } from 'mithril-markdown';

...

  m(MarkdownEditor, {
    parse: marked,
    // parse: render,
    preview: 500,
    markdown: '# Hello, world',
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
