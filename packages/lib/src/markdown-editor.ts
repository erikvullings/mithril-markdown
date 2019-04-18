import m, { FactoryComponent, Attributes } from 'mithril';
import myMarked, { MarkedOptions } from 'marked';
import { TextArea } from './text-area';
import { toggle, ISelection, isLinkClicked } from './helpers';
import { ICommandConfig, commands } from './commands';

export interface IMarkdownEditor extends Attributes {
  /** Markdown to render */
  markdown: string;
  /** If true, do not allow the markdown to be rendered, only displaying the HTML */
  disabled?: boolean;
  /** Options for the markdown parser, marked */
  options?: MarkedOptions;
  /**
   * When a change occurs, the updated markdown is returned, as well as the HTML.
   * The returned markdown should be used as the markdown input for the editor in
   * order to continue editing.
   */
  onchange?: (markdown: string, html: string) => void;
}

export const MarkdownEditor: FactoryComponent<IMarkdownEditor> = () => {
  const state = {
    markdown: '',
    html: '',
    undoBufferIndex: 0,
    undoBuffer: [],
    isEditing: false,
  } as {
    onchange?: (markdown: string, html: string) => void;
    markdown: string;
    html: string;
    /** The current position in the undo buffer */
    undoBufferIndex: number,
    /** Undo buffer to track changes and to be able to undo or redo commands */
    undoBuffer: string[];
    isEditing: boolean;
    selection?: ISelection;
  };

  const runCmd = (cmd: ICommandConfig) => {
    const { selection, markdown } = state;
    state.isEditing = true;
    state.markdown = toggle(markdown, cmd, selection);
    emitChange();
  };

  const stopEditingCmd = () => (state.isEditing = false);

  const emitChange = () => {
    const { markdown, onchange } = state;
    state.html = myMarked(markdown);
    if (onchange) {
      onchange(markdown, state.html);
    }
  };

  return {
    oninit: ({ attrs: { markdown, onchange, options } }) => {
      // Set options
      // `highlight` example uses `highlight.js`
      myMarked.setOptions({
        ...{
          renderer: new myMarked.Renderer(),
          // highlight: (code) => require('highlight.js').highlightAuto(code).value,
          headerIds: true,
          headerPrefix: 'header',
          langPrefix: 'ts',
          pedantic: false,
          gfm: true,
          tables: true,
          breaks: true,
          sanitize: false,
          smartLists: true,
          smartypants: true,
          xhtml: false,
        },
        ...options,
      });

      state.html = myMarked(markdown);
      state.onchange = onchange;
    },
    view: ({ attrs: { markdown, ...props } }) => {
      state.markdown = markdown;
      const { html, isEditing } = state;

      return isEditing
        ? m(
            '.markdown-editor',
            {
              onfocus: () => {
                state.isEditing = true;
              },
            },
            [
              ...commands.map(cmd =>
                m(
                  'a',
                  {
                    style: 'margin: 0 10px 0 0; cursor: pointer;',
                    onclick: () => runCmd(cmd),
                  },
                  cmd.name
                )
              ),
              m('a', { onclick: stopEditingCmd }, ' STOP '),
              m(TextArea, {
                ...props,
                initialValue: markdown,
                onselection: (selection: ISelection) => {
                  state.selection = selection;
                },
                onchange: (md: string) => {
                  state.markdown = md;
                  emitChange();
                },
              }),
            ]
          )
        : m(
            '.text-area',
            {
              onclick: (e: Event) => {
                state.isEditing = !isLinkClicked(e);
              },
            },
            m.trust(html)
          );
    },
  };
};
