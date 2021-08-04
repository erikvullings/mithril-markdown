import m from 'mithril';
import marked from 'marked';
import { render } from 'slimdown-js';
import { CodeBlock } from 'mithril-materialized';
import { MarkdownEditor } from 'mithril-markdown';

export const EditorPage = () => {
  const state = {
    markdown: `# Chapter

## Section

**CLICK ON ME TO START EDITING**

Visit [Google](https://www.google.com).

This is a short line.

Now this is a very long line, intended to wrap in the editor. But without line breaks, so when we perform a multiline action, it should be treated as a single line.

This is a short list.
Each line is separated by a line break.
Multiline actions should be performed on each line.

Shopping list
- Item 1
- Item 2
`,
  };

  // Create reference instance
  // Set options
  // `highlight` example uses `highlight.js`
  marked.setOptions({
    renderer: new marked.Renderer(),
    // highlight: (code) => require('highlight.js').highlightAuto(code).value,
    headerIds: true,
    headerPrefix: 'header',
    langPrefix: 'ts',
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false,
  });

  // Get reference
  const renderer = new marked.Renderer();

  // Override function
  renderer.heading = (text: string, level: number) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level}>
  <a name="${escapedText}" class="anchor" href="#${escapedText}">
    <span class="header-link"></span>
  </a>${text}
</h${level}>`;
  };

  const placeholder = '_Click here to edit_';
  return {
    view: () =>
      m('.col.s12', [
        m('h3.header', 'MarkdownEditor'),

        m('h4', "Using 'slimdown-js' for processing markdown"),
        m(MarkdownEditor, {
          placeholder,
          isEditing: true,
          parse: render,
          preview: 400,
          markdown: state.markdown,
          onchange: (markdown) => {
            console.log(markdown);
          },
        }),

        m('h4', "Using 'marked' for processing markdown"),
        m(MarkdownEditor, {
          buttonSize: 25,
          tooltips: {
            bold: 'Vetgedrukt',
            italics: 'Scheefgedrukt',
            inline: 'Monospace',
            strikethrough: 'Doorgestreken',
            link: 'Maak een link',
            image: 'Plaatje',
            code: 'Code blok',
            unordered: 'Lijst met bullets',
            ordered: 'Genummerde lijst',
            block: 'Quote',
            undo: 'Ongedaan maken',
            redo: 'Opnieuw',
            visibility: 'Toon resultaat',
            close: 'Stop met schrijven',
          },
          placeholder,
          parse: marked,
          preview: 400,
          // style: 'height: 200px; max-height: 200px',
          // autoResize: false,
          markdown: state.markdown,
          onchange: (markdown) => {
            console.log(markdown);
          },
        }),

        m('h2.header', 'Disabled MarkdownEditor'),

        m(MarkdownEditor, {
          placeholder,
          parse: marked,
          preview: 400,
          disabled: true,
          markdown: "This markdown editor is disabled. Clicking on it won't help, and the cursor is not set either.",
        }),

        m(CodeBlock, {
          code: `import { MarkdownEditor } from 'mithril-markdown';
import marked from 'marked';
import m from 'mithril';

...

    m(MarkdownEditor, {
      placeholder: '_Click here to edit_',
      // Use marked or render for processing the markdown
      parse: render,
      preview: 200,
      // disabled: true, // Optionally, disable it, turning the editor into a preview window
      // style: 'height: 200px; max-height: 200px',
      // autoResize: false,
      markdown: state.markdown,
      onchange: (markdown) => {
        console.log(markdown);
      },
      buttonSize: 25, // default 16
      // Add optional tooltips: below is the default, 
      // but you can also set it to \`false\` to hide them completely.
      tooltips: {
        bold: 'Bold text',
        italics: 'Italics text',
        inline: 'Inline code',
        strikethrough: 'Strike-through',
        link: 'Create link',
        image: 'Create image link',
        code: 'Code block',
        unordered: 'Bullet list',
        ordered: 'Numbered list',
        block: 'Blockquote',
        undo: 'Undo',
        redo: 'Redo',
        visibility: 'Toggle output',
        close: 'Stop editing',
      } as Record<TooltipKey, string>
    }),
`,
        }),
      ]),
  };
};
