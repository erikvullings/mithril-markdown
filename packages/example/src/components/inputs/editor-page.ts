import { CodeBlock } from 'mithril-materialized';
import { MarkdownEditor } from 'mithril-markdown';
import m from 'mithril';
import '/node_modules/mithril-markdown/dist/index.css';

export const EditorPage = () => {
  const state = {
    markdown: `
# Chapter

## Section

**Hello, world**

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
          // style: 'height: 200px; max-height: 200px',
          // autoResize: false,
          markdown: state.markdown,
          onchange: (markdown) => {
            // console.log(markdown);
          },
        }),

        m(CodeBlock, {
          code: `import { ContentEditable } from 'mithril-markdown';
import m from 'mithril';

...

    m(ContentEditable, {
      // Original HTML input
      html: state.html,
      // Returns the updated HTML code
      onchange: html => {
        state.html = html;
        console.log(html);
      },
      // Example to prevent the user from entering commas
      onkeydown: e => {
        if (e.key === ',') {
          e.preventDefault();
        }
      },
      // Replace the base tag, if needed
      tagName: 'div',
      // By default, &amp; etc are replaced by their normal counterpart when losing focus.
      // cleanupHtml: false,
      // By default, don't allow the user to enter newlines
      // preventNewline: false,
      // By default, select all text when the element receives focus
      // selectAllOnFocus: false,
      // By default, when pasting text, remove all HTML and keep the plain text.
      // pasteAsPlainText: false,
    }),
`,
        }),
      ]),
  };
};
