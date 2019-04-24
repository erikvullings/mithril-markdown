import { ICommandConfig } from './commands';

export interface ISelection {
  text?: string | string[];
  selectionStart: number;
  selectionEnd: number;
}

export const replaceBetween = (
  original: string,
  { text, selectionStart = 0, selectionEnd = original.length }: ISelection
) => original.substring(0, selectionStart) + text + original.substring(selectionEnd);

/**
 * Look for the active line that contains the selected text.
 * Only used for multiline = false actions, so just the first line is returned.
 */
export const getActiveLine = (doc: string, { selectionStart = 0 }: ISelection) => {
  const lines = doc.split('\n');
  const { startIndex, startPos } = lines.reduce(
    (acc, cur, i) => {
      const length = cur.length + 1; // +1 for the stripped \n
      if (acc.total <= selectionStart && selectionStart <= acc.total + length) {
        acc.startIndex = i;
        acc.startPos = acc.total;
      }
      acc.total += length;
      return acc;
    },
    { total: 0, startIndex: 0, startPos: 0 }
  );
  const text = lines[startIndex];
  const selection = {
    text,
    selectionStart: startPos,
    selectionEnd: startPos + text.length,
  } as ISelection;
  return selection;
};

/** Get the selected words in a single sentence. */
export const getWords = (doc: string, selection: ISelection) => {
  if (!doc) {
    return {} as ISelection;
  }
  const { text, selectionStart } = getActiveLine(doc, selection);
  if (!text || text instanceof Array) {
    return {} as ISelection;
  }
  const spacePreceding = text.lastIndexOf(' ', selection.selectionStart - selectionStart);
  let spaceFollowing = text.indexOf(' ', selection.selectionEnd - selectionStart - 1);
  if (spaceFollowing === -1) {
    spaceFollowing = text.length;
  }
  const finalSelection = {
    text: text.substring(spacePreceding + 1, spaceFollowing),
    selectionStart: selectionStart + spacePreceding + 1 || selection.selectionStart,
    selectionEnd: selectionStart + spaceFollowing || selection.selectionEnd,
  } as ISelection;
  return finalSelection;
};

/** Remove empty lines consisting of whitespace from the selection */
const trimLines = (selection: ISelection) => {
  const emptyLine = /^\s*$/gi;
  const { text, selectionStart, selectionEnd } = selection;
  let trimStart = true;
  return (text as string[]).reduce((acc, cur) => {
    if (emptyLine.test(cur)) {
      if (trimStart) {
        acc.selectionStart += cur.length + 1;
      } else {
        acc.selectionEnd -= cur.length + 1;
      }
    } else {
      acc.text.push(cur);
      trimStart = false;
    }
    return acc;
  }, { text: [] as string[], selectionStart, selectionEnd });
};

/**
 * Look for the active lines that contains the selected text.
 * Only used for multiline = true actions, so one or more lines is returned.
 */
export const getActiveLines = (doc: string, { selectionStart = 0, selectionEnd = 0 }: ISelection) => {
  const lines = doc.split('\n');
  const { startIndex, startPos, endIndex, endPos } = lines.reduce(
    (acc, cur, i) => {
      const length = cur.length + 1; // +1 for the stripped \n
      const newPos = acc.curPos + length;
      if (acc.curPos <= selectionStart && selectionStart <= newPos + 1) {
        acc.startIndex = i;
        acc.startPos = acc.curPos;
      }
      if (acc.curPos <= selectionEnd && selectionEnd <= newPos + 1) {
        acc.endIndex = i;
        acc.endPos = newPos;
      }
      acc.curPos = newPos;
      return acc;
    },
    { curPos: 0, startIndex: 0, startPos: 0, endIndex: lines.length - 1, endPos: doc.length - 1 }
  );
  const selection = {
    text: lines.slice(startIndex, endIndex + 1),
    selectionStart: startPos,
    selectionEnd: endPos,
  } as ISelection;
  return trimLines(selection) as ISelection;
};

/** Execute the command on the text */
export const executeCmd = (doc: string, cmd: ICommandConfig, selection: ISelection) => {
  const { detect, on, off, multiline, merge, offsets = [0, 0] } = cmd;
  const { text = ' ', selectionStart = selection.selectionStart, selectionEnd = selection.selectionEnd } = multiline
    ? getActiveLines(doc, selection)
    : getWords(doc, selection);
  const updater = (t: string, i = 0) =>
    detect.test(t) ? t.replace(off[0], off[1]) : t.replace(on[0], on[1].replace(/1\. /, `${i + 1}. `));
  const updated =
    text instanceof Array ? (merge ? updater(text.join('\n')) : text.map(updater).join('\n') + '\n') : updater(text);
  const newSelection = {
    text: updated,
    selectionStart,
    selectionEnd,
  };
  const onStateMult = updated.length > selectionEnd - selectionStart ? 1 : -1;
  const multilineMult = multiline && !merge ? text.length : 1;
  return {
    markdown: replaceBetween(doc, newSelection),
    selection: {
      text: updated,
      selectionStart: selectionStart + onStateMult * multilineMult * offsets[0],
      selectionEnd: selectionEnd + onStateMult * multilineMult * offsets[1],
    },
  };
};

/** Returns true if an anchor is clicked. */
export const isLinkClicked = (e: Event) => {
  const target = (e.target || {}) as HTMLElement;
  return target.tagName && target.tagName.toLowerCase() === 'a' ? true : false;
};

export const debounce = <F extends (...params: any[]) => void>(fn: F, delay = 100) => {
  let timeoutID: number;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
};
