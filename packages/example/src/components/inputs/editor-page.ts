import { CodeBlock } from 'mithril-materialized';
import { MarkdownEditor } from 'mithril-markdown';
import m from 'mithril';

export const EditorPage = () => {
  const state = {
    markdown: `
# Chapter

## Section

**CLICK ON ME TO START EDITING**

Visit [Google](https://www.google.com).

This is a short line.

Now this is a very long line, intended to wrap in the editor. But without linebreaks, so when we perform a multiline action, it should be treated as a single line.

This is a short list.
Each line is separated by a linebreak.
Multiline actions should be performed on each line.
`,
  };
  return {
    view: () =>
      m('.col.s12', [
        m('h2.header', 'MarkdownEditor'),

        m(MarkdownEditor, {
          preview: 400,
          // style: 'height: 200px; max-height: 200px',
          // autoResize: false,
          markdown: state.markdown,
          onchange: (markdown) => {
            console.log(markdown);
          },
        }),

        m(CodeBlock, {
          code: `import { MarkdownEditor } from 'mithril-markdown';
import m from 'mithril';

...

    m(MarkdownEditor, {
      preview: 200,
      // style: 'height: 200px; max-height: 200px',
      // autoResize: false,
      markdown: state.markdown,
      onchange: (markdown) => {
        console.log(markdown);
      },
    }),
`,
        }),
      ]),
  };
};
