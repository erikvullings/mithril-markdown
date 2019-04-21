import m, { FactoryComponent, Attributes } from 'mithril';
import { ISelection } from '.';

export interface ITextArea extends Attributes {
  /** Initially displayed value */
  initialValue: string;
  /** Caret position (selectionStart) */
  caretPosition: number;
  /** If true, cannot be edited */
  disabled?: boolean;
  /** Fired when the document is changed, after loosing focus */
  onchange?: (markdown: string) => void;
  /** Fired when the document is changed, after every input */
  oninput?: (markdown: string, caretPosition: number) => void;
  /** Fired when a text is selected */
  onselection?: (selection: ISelection) => void;
  /** If true, auto resize the height of the textarea */
  autoResize?: boolean;
}

/** Create a TextArea */
export const TextArea: FactoryComponent<ITextArea> = () => {
  const state = {
    shifted: false,
    selection: {},
  } as {
    dom: HTMLTextAreaElement;
    selection: ISelection;
    height: number;
    shifted: boolean;
    onselection?: (selection: ISelection) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    style: string;
  };

  const autoResizeTextArea = (autoResize?: boolean) => {
    if (autoResize) {
      const { dom, height } = state;
      const scrollHeight = dom.scrollHeight;
      if (scrollHeight === height) {
        return;
      }
      state.height = scrollHeight;
      dom.style.height = `${scrollHeight}px`;
    }
  };

  const selectionHandler = (e: MouseEvent | KeyboardEvent) => {
    // The following is important, otherwise the event handling will redraw the component,
    // ignoring an edit that was made
    (e as any).redraw = false;
    if (e.type === 'keydown') {
      state.shifted = e.shiftKey;
      if (state.onkeydown) {
        state.onkeydown(e as KeyboardEvent);
      }
      return;
    }
    const { shifted, onselection, dom } = state;
    if (e.type === 'mouseup' || (shifted && ((e as KeyboardEvent).keyCode === 39 || 37 || 38 || 40))) {
      const selection = window.getSelection();
      if (selection && onselection) {
        const selectionStart = dom.selectionStart;
        const selectionEnd = dom.selectionEnd;
        const text = selection.toString() || dom.value.substring(selectionStart, selectionEnd);
        state.selection = {
          text,
          selectionStart,
          selectionEnd,
        };
        onselection(state.selection);
      }
    }
  };

  return {
    oninit: ({ attrs: { onselection, style, autoResize, onkeydown } }) => {
      state.onselection = onselection;
      state.onkeydown = onkeydown;
      state.style = `${autoResize ? 'padding: 10px; box-sizing: border-box; overflow-x: hidden; resize: none;' : ''}${
        style ? style : ''
      }${autoResize && style && /max-height/.test(style) ? '' : 'overflow-y: hidden'}`;
    },
    view: ({ attrs }) => {
      const { initialValue, caretPosition, onchange, className, onblur, oninput, autoResize } = attrs;
      const { style } = state;

      return m('textarea.markdown-editor-textarea[tabindex=0]', {
        class: className,
        style,
        oncreate: ({ dom }) => {
          state.dom = dom as HTMLTextAreaElement;
          state.dom.selectionStart = caretPosition;
          autoResizeTextArea(autoResize);
        },
        onblur,
        onupdate: () => {
          const { dom, selection: { selectionStart, selectionEnd} } = state;
          if (selectionStart && selectionEnd) {
            dom.focus();
            dom.setSelectionRange(selectionStart, selectionEnd);
          }
        },
        onmouseup: selectionHandler,
        onkeydown: selectionHandler,
        onkeyup: selectionHandler,
        oninput: (e: Event) => {
          (e as any).redraw = false;
          const { dom } = state;
          autoResizeTextArea(autoResize);
          if (oninput) {
            oninput((e.target as HTMLTextAreaElement).value, dom.selectionStart);
          }
        },
        onchange: onchange
          ? (e: Event) => {
              (e as any).redraw = false;
              // Only fired when the element looses focus
              onchange((e.target as HTMLTextAreaElement).value);
            }
          : undefined,
        value: initialValue,
      });
    },
  };
};
