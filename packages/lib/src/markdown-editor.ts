import m, { FactoryComponent, Attributes } from 'mithril';
import marked, { MarkedOptions } from 'marked';
import { TextArea } from './text-area';
import { executeCmd, ISelection, isLinkClicked, debounce } from './helpers';
import { ICommandConfig, commands } from './commands';
import { IUndoRedo, undoRedo } from './undo-redo';
import { undoIcon, redoIcon, stopIcon, visibilityOnIcon, visibilityOffIcon } from './assets/index';
import './markdown-editor.css';

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
  /** Add a preview when the value is true, or a number is specified (taken as the height of the area) */
  preview?: boolean | number;
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
    selection: { selectionStart: 0, selectionEnd: 0 },
  } as {
    onchange?: (markdown: string, html: string) => void;
    markdown: string;
    html: string;
    isEditing: boolean;
    selection: ISelection;
    undo: IUndoRedo<{ markdown: string; selection: ISelection }>;
    undoDom: HTMLAnchorElement;
    redoDom: HTMLAnchorElement;
    shortcuts: { [key: string]: () => void };
    previewDom?: HTMLDivElement;
    showPreview?: boolean;
    showPreviewHeight?: number;
  };

  const runCmd = (cmd: ICommandConfig) => {
    const { selection: initialSelection, markdown: original } = state;
    state.isEditing = true;
    // state.markdown = executeCmd(original, cmd, initialSelection);
    const { markdown, selection } = executeCmd(original, cmd, initialSelection);
    state.markdown = markdown;
    state.selection = selection;
    emitChange();
  };

  const stopEditingCmd = () => (state.isEditing = false);

  const updatePreview = () => {
    const {
      previewDom,
      markdown,
      selection: { selectionStart },
    } = state;
    if (previewDom) {
      const y = (selectionStart / markdown.length) * previewDom.scrollHeight;
      const render = () => m('div', m.trust(marked(markdown)));
      m.render(previewDom, render());
      previewDom.scrollTo(0, y);
    }
  };

  const emitChange = (saveState = true) => {
    const { markdown, selection, onchange } = state;
    state.html = marked(markdown);
    if (saveState) {
      saveUndoState(markdown, selection);
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

  const saveUndoState = (markdown: string, selection: ISelection) => {
    const { undo } = state;
    state.markdown = markdown;
    state.selection = selection;
    undo.add({ markdown, selection });
    updatePreview();
  };

  const oninput = debounce(saveUndoState, 500);

  const undoRedoCmd = (isUndo: boolean) => {
    const { undo } = state;
    state.isEditing = true;
    if ((isUndo && !undo.canUndo()) || (!isUndo && !undo.canRedo())) {
      return;
    }
    const { markdown, selection } = isUndo ? undo.undo() : undo.redo();
    state.markdown = markdown;
    state.selection = selection;
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
      (e as any).redraw = true;
    }
  };

  return {
    oninit: ({ attrs: { markdown, onchange, options, undoLimit = 10, preview } }) => {
      if (preview) {
        state.showPreview = true;
        if (typeof preview === 'number') {
          state.showPreviewHeight = preview;
        }
      }
      // Set options
      // `highlight` example uses `highlight.js`
      marked.setOptions({
        ...{
          renderer: new marked.Renderer(),
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

      const { selection } = state;
      state.markdown = markdown;
      state.html = marked(markdown);
      state.onchange = onchange;
      state.undo = undoRedo(
        { markdown, selection },
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
    view: ({ attrs: { autoResize = true, preview, ...props } }) => {
      const { html, isEditing, markdown, selection, undo, showPreview, showPreviewHeight: previewHeight } = state;

      return isEditing
        ? m(
            '.markdown-editor',
            {
              onfocus: () => {
                state.isEditing = true;
              },
            },
            [
              m('.markdown-editor-button-group', [
                ...commands.map(cmd =>
                  m(
                    'button.markdown-editor-button',
                    { onclick: () => runCmd(cmd) },
                    cmd.icon ? m('img', { width: '25', height: '25', src: cmd.icon, alt: cmd.name }) : cmd.name
                  )
                ),
                m(
                  'button.markdown-editor-button',
                  {
                    className: undo.canRedo() ? undefined : 'disabled',
                    onclick: () => undo.canRedo() && undoRedoCmd(false),
                    oncreate: ({ dom }) => (state.redoDom = dom as HTMLAnchorElement),
                  },
                  m('img', { width: '25', height: '25', src: redoIcon, alt: 'REDO' })
                ),
                m(
                  'button.markdown-editor-button',
                  {
                    className: undo.canUndo() ? undefined : 'disabled',
                    onclick: () => undo.canUndo() && undoRedoCmd(true),
                    oncreate: ({ dom }) => (state.undoDom = dom as HTMLAnchorElement),
                  },
                  m('img', { width: '25', height: '25', src: undoIcon, alt: 'UNDO' })
                ),
                m(
                  'button.markdown-editor-button.markdown-editor-right',
                  { onclick: stopEditingCmd },
                  m('img', { width: '25', height: '25', src: stopIcon, alt: 'STOP' })
                ),
                m(
                  'button.markdown-editor-button.markdown-editor-right',
                  { onclick: () => state.showPreview = !showPreview },
                  m('img', {
                    width: '25',
                    height: '25',
                    src: showPreview ? visibilityOnIcon : visibilityOffIcon,
                    alt: 'VISIBILITY',
                  })
                ),
              ]),
              m(TextArea, {
                ...props,
                selection,
                markdown,
                autoResize,
                onkeydown: invokeCmdShortcut,
                onselection: (s: ISelection) => {
                  state.selection = s;
                },
                onchange: (md: string) => {
                  state.markdown = md;
                  emitChange();
                },
                oninput,
              }),
              showPreview
                ? m('.preview', {
                    oncreate: ({ dom }) => {
                      state.previewDom = dom as HTMLDivElement;
                      updatePreview();
                    },
                    style: previewHeight ? `height: ${previewHeight}px; overflow-y: auto;` : undefined,
                  })
                : undefined,
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
