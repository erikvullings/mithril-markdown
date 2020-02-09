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

There is a small [playground](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4IWAA60ATsQAEcrHLDTaSgORYIxQtOgABNDAAexdQG4AOmnFTZc4HICyGaQGsAJrQDuaAKIe2jJyrMqqGlo6elAAtFiunj5oFtbWQnDyJtgSsHIAvHIAFACU+QB8DtYK6fIZGIz5lWgKCvHuXr6IcgAG1gDEcgDChBgSjNKpaH0DAMow1MQQ9JMAVCuDADIAkoMA0nIA8gByzn5yACoHcjPnAIIASudyfgAiW+dbRwDia5MAahA4No5MgvrRaABzWAAXUKJGIEjgiAA9MjvOj8BDwVCYPg6FhivhJudCIC5GSMHI4IQZPIoBAjES0NYjj45DoyRS5AA3GDSACecig9AhQoZMAo5OEaA8MA87Nocm80lGUvZhBgcjlQWk+DkACEAK7ybzaGnGsVGABG0hgGDccElcEV3g1zW8mokfLAMiUlKwhqgi3pRjkGAWSzQkuB1NogflVs1xFt9TlYbgYapDJxltxxNJGa5sfs9IyTL84cIufJGbgMAkrlTCcFlJDMBtdrcTKcgeD4rDEfotfNUATnu9vrT9C1ldzTN6zRCVTktuIhukzWAy4U3IgMG8XRK5SaLRaNQcigSHWaoQKdUYVkXp9X6+aWEKLnaSQCOsljjaiS+CExTbiEFDLqw1iQcyaBYPgWBxgwhReNQho4Aw+BWrQHj8pKWSSLAxSUCAdawIOaAIDwACMAAciAAExUWwHAgJgOB4HicACDQ9CMMwPD4HoEIkCeyjCvUXRCSJACEti0hgDCPtBjCmK4dqiaaHg6F0VEAAy6QApI+ChWuGbgQqohoyjEdDCtIXTJgpcANrailQcRpHzIsQ54AALIgVG+Ww0KsEAA) on [flems.io](https://flems.io).

## Usage example

```ts
import m from 'mithril';
import marked from 'marked';
import { MarkdownEditor } from 'mithril-markdown';

...

  m(MarkdownEditor, {
    parse: marked,
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
