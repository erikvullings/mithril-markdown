import m, { FactoryComponent, Attributes } from 'mithril';
import myMarked, { MarkedOptions } from 'marked';
import { TextArea } from './text-area';
import { toggle, ISelection, isLinkClicked, debounce } from './helpers';
import { ICommandConfig, commands } from './commands';
import { IUndoRedo, undoRedo } from './undo-redo';

export interface IMarkdownEditor extends Attributes {
  /** Markdown to render */
  markdown: string;
  /** If true, do not allow the markdown to be rendered, only displaying the HTML */
  disabled?: boolean;
  /** Options for the markdown parser, marked */
  options?: MarkedOptions;
  /** Undo buffer limit, @default 10 */
  undoLimit?: number;
  /** Should the textarea automatically resize */
  autoResize?: boolean;
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
    isEditing: false,
    shortcuts: {},
  } as {
    onchange?: (markdown: string, html: string) => void;
    markdown: string;
    caretPosition: number;
    html: string;
    isEditing: boolean;
    selection?: ISelection;
    undo: IUndoRedo<{ markdown: string; caretPosition: number }>;
    undoDom: HTMLAnchorElement;
    redoDom: HTMLAnchorElement;
    shortcuts: { [key: string]: () => void };
  };

  const runCmd = (cmd: ICommandConfig) => {
    const { selection, markdown } = state;
    state.isEditing = true;
    state.markdown = toggle(markdown, cmd, selection);
    emitChange();
  };

  const stopEditingCmd = () => (state.isEditing = false);

  const emitChange = (saveState = true) => {
    const { markdown, caretPosition, onchange } = state;
    state.html = myMarked(markdown);
    if (saveState) {
      saveUndoState(markdown, caretPosition);
    }
    if (onchange) {
      onchange(markdown, state.html);
    }
  };

  const setLinkStyle = (dom: HTMLElement, enable: boolean) => {
    if (enable) {
      dom.style.cursor = 'pointer';
      dom.style.color = '';
      dom.style.opacity = '1';
      dom.style.textDecoration = '';
    } else {
      dom.style.cursor = 'not-allowed';
      dom.style.color = 'currentColor';
      dom.style.opacity = '0.5';
      dom.style.textDecoration = 'none';
    }
  };

  const saveUndoState = (markdown: string, caretPosition: number) => {
    const { undo } = state;
    state.markdown = markdown;
    state.caretPosition = caretPosition;
    undo.add({ markdown, caretPosition });
  };

  const oninput = debounce(saveUndoState, 500);

  const undoRedoCmd = (isUndo: boolean) => {
    const { undo } = state;
    state.isEditing = true;
    if ((isUndo && !undo.canUndo()) || (!isUndo && !undo.canRedo())) {
      return;
    }
    const { markdown, caretPosition } = isUndo ? undo.undo() : undo.redo();
    state.markdown = markdown;
    state.caretPosition = caretPosition;
    emitChange(false);
    m.redraw();
  };

  /** Handle onkeydown to see if we need to call a command */
  const invokeCmdShortcut = (e: KeyboardEvent) => {
    if (!e.ctrlKey) {
      return;
    }
    const key = `CTRL+${e.key ? e.key.toUpperCase() : ''}`;
    const { shortcuts } = state;
    if (shortcuts.hasOwnProperty(key)) {
      shortcuts[key]();
      e.preventDefault();
      e.stopPropagation();
      m.redraw();
    }
  };

  const enabledStyle = 'margin: 0 10px 0 0; cursor: pointer;';
  const disabledStyle =
    'margin: 0 10px 0 0; cursor: not-allowed; color: currentColor; opacity: 0.5; text-decoration: none';

  return {
    oninit: ({ attrs: { markdown, caretPosition, onchange, options, undoLimit = 10 } }) => {
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
      state.undo = undoRedo(
        { markdown, caretPosition },
        undoLimit,
        s => setLinkStyle(state.undoDom, s),
        s => setLinkStyle(state.redoDom, s)
      );
      state.shortcuts = [
        ...commands.filter(cmd => cmd.shortcut).map(cmd => ({ key: cmd.shortcut, cmd: () => runCmd(cmd) })),
        { key: 'CTRL+Z', cmd: () => undoRedoCmd(true) },
        { key: 'CTRL+Y', cmd: () => undoRedoCmd(false) },
        { key: 'CTRL+S', cmd: () => stopEditingCmd() },
      ].reduce(
        (acc, cur) => {
          acc[cur.key] = cur.cmd;
          return acc;
        },
        {} as { [key: string]: () => void }
      );
    },
    view: ({ attrs: { markdown, caretPosition, autoResize = true, ...props } }) => {
      state.markdown = markdown;
      const { html, isEditing, undo } = state;

      return isEditing
        ? m(
            '.markdown-editor',
            {
              onfocus: () => {
                state.isEditing = true;
              },
            },
            [
              ...commands.map(cmd => m('a', { style: enabledStyle, onclick: () => runCmd(cmd) }, cmd.name)),
              m(
                'a',
                {
                  style: undo.canUndo() ? enabledStyle : disabledStyle,
                  onclick: () => undoRedoCmd(true),
                  oncreate: ({ dom }) => (state.undoDom = dom as HTMLAnchorElement),
                },
                ' UNDO '
              ),
              m(
                'a',
                {
                  style: undo.canRedo() ? enabledStyle : disabledStyle,
                  onclick: () => undoRedoCmd(false),
                  oncreate: ({ dom }) => (state.redoDom = dom as HTMLAnchorElement),
                },
                ' REDO '
              ),
              m('a', { style: enabledStyle, onclick: stopEditingCmd }, ' STOP '),
              m(TextArea, {
                ...props,
                caretPosition,
                initialValue: markdown,
                autoResize,
                onkeydown: invokeCmdShortcut,
                onselection: (selection: ISelection) => {
                  state.selection = selection;
                },
                onchange: (md: string) => {
                  state.markdown = md;
                  emitChange();
                },
                oninput,
              }),
            ]
          )
        : m(
            '.html-area',
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
