import m, { FactoryComponent, Attributes } from 'mithril';

export interface IContentEditable extends Attributes {
  /** Required HTML input that must be rendered */
  html: string;
  /**
   * Optional custom HTML tag.
   * @default div
   */
  tagName?: string;
  /**
   * If disabled is true, editing is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, remove all HTML content when pasting text and only retain the text.
   * @default true
   */
  pasteAsPlainText?: boolean;
  /**
   * If true, replace special HTML characters by their plain equivalent,
   * e.g. the non-breaking space `&nbsp;`, `&amp;`, `&gt;`, and `&lt;`.
   * Is only applied when the element looses focus (otherwise, the cursor
   * position may get lost).
   * @default true
   */
  cleanupHtml?: boolean;
  /**
   * If true, prevent a newline to be entered.
   * @default true
   */
  preventNewline?: boolean;
  /**
   * If true, select the whole cell on focus.
   * @default true
   */
  selectAllOnFocus?: boolean;
  /** Handle the change event, returns the HTML and the original event */
  onchange?: (html: string, evt?: Event) => void;
  /** Attach to the onfocus event */
  onfocus?: (evt?: Event) => void;
  /** Handle the keydown event when the user presses a key. */
  onkeydown?: (e: KeyboardEvent) => void;
}

/**
 * A simple component for an HTML element with editable contents.
 * Loosely inspired by react-contenteditable and Tania Rascia's content-editable tutorial.
 * @see https://github.com/lovasoa/react-contenteditable
 * @see https://www.taniarascia.com/content-editable-elements-in-javascript-react/
 */
export const ContentEditable: FactoryComponent<IContentEditable> = () => {
  const state = {} as {
    dom: HTMLDivElement;
    lastHtml?: string;
    onchange?: (html: string, evt?: Event) => void;
  };

  /** Emit the change to the user. */
  const emitChange = (originalEvt: Event, cleanupHtml = false) => {
    const { dom, onchange, lastHtml } = state;
    const html = cleanupHtml ? trimSpaces(dom.innerHTML) : dom.innerHTML;

    if (onchange && html !== lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html,
        },
      });
      onchange(html, evt);
    }
    state.lastHtml = html;
  };

  /** Remove all HTML content when pasting, and retain only the plain text. */
  const pastePlainText = (event: ClipboardEvent) => {
    event.preventDefault();

    const text = event.clipboardData && event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text || '');
  };

  /** Clean up HTML content */
  const trimSpaces = (s: string) => {
    return s
      .replace(/&nbsp;/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<');
  };

  /** Disable entering a new line */
  const disableNewlines = (event: KeyboardEvent) => {
    const keyCode = event.keyCode || event.which;

    if (keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  };

  const selectAll = () => {
    setTimeout(() => {
      document.execCommand('selectAll', false);
    }, 0);
  };

  return {
    oncreate: ({ dom, attrs: { onchange } }) => {
      state.onchange = onchange;
      state.dom = dom as HTMLDivElement;
    },
    view: ({
      attrs: {
        html,
        tagName = 'div',
        disabled = false,
        pasteAsPlainText = true,
        cleanupHtml = true,
        preventNewline = true,
        selectAllOnFocus = true,
        onchange,
        onfocus,
        onblur,
        ...props
      },
    }) => {
      return m(
        tagName,
        {
          ...props,
          contenteditable: !disabled,
          onfocus: (e: Event) => {
            if (selectAllOnFocus) {
              selectAll();
            }
            if (onfocus) {
              onfocus(e);
            }
          },
          oninput: emitChange,
          onblur: (e: Event) => {
            emitChange(e, cleanupHtml);
            if (onblur) {
              onblur(e);
            }
          },
          onpaste: pasteAsPlainText ? pastePlainText : undefined,
          onkeypress: preventNewline ? disableNewlines : undefined,
        },
        m.trust(html)
      );
    },
  };
};
