import m, { FactoryComponent, Attributes } from 'mithril';
import { ISelection } from '.';

declare var M: any;

export interface ITextArea extends Attributes {
  initialValue: string;
  disabled?: boolean;
  onchange?: (txt: string) => void;
  /** Fired when a text is selected */
  onselection?: (selection: ISelection) => void;
}

/** Create a TextArea */
export const TextArea: FactoryComponent<ITextArea> = () => {
  const state = {
    shifted: false,
    selection: {},
  } as {
    dom: HTMLTextAreaElement;
    selection: ISelection;
    shifted: boolean;
    onselection?: (selection: ISelection) => void;
  };

  const selectionHandler = (e: MouseEvent | KeyboardEvent) => {
    // The following is important, otherwise the event handling will redraw the component,
    // ignoring an edit that was made
    (e as any).redraw = false;
    if (e.type === 'keydown') {
      state.shifted = e.shiftKey;
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
    oninit: ({ attrs: { onselection } }) => {
      state.onselection = onselection;
    },
    view: ({ attrs }) => {
      const { initialValue, onchange, className, style, onblur, oninput } = attrs;
      return m(`.input-field`, { className, style }, [
        m('textarea.materialize-textarea[tabindex=0]', {
          oncreate: ({ dom }) => {
            state.dom = dom as HTMLTextAreaElement;
            if (M) {
              M.textareaAutoResize(dom);
            }
          },
          onblur,
          // onupdate: () => {
          //   console.log('updating');
          //   const { dom, selection: { selectionStart, selectionEnd} } = state;
          //   if (selectionStart && selectionEnd) {
          //     console.log(`setting selection from ${selectionStart} - ${selectionEnd}`);
          //     dom.focus();
          //     dom.setSelectionRange(selectionStart, selectionEnd);
          //   }
          // },
          onmouseup: selectionHandler,
          onkeydown: selectionHandler,
          onkeyup: selectionHandler,
          oninput: oninput
            ? (e: Event) => {
                (e as any).redraw = false;
                oninput((e.target as HTMLTextAreaElement).value);
              }
            : undefined,
          onchange: onchange
            ? (e: Event) => {
                (e as any).redraw = false;
                // Only fired when the element looses focus
                onchange((e.target as HTMLTextAreaElement).value);
              }
            : undefined,
          value: initialValue,
        }),
      ]);
    },
  };
};
