export interface IUndoRedo<T> {
  /** Reset to the initial state */
  reset: (initialValue: T) => void;
  /** Add an item to the undo stack */
  add: (item: T) => void;
  /** Returns true when undo can be done */
  canUndo: () => boolean;
  /** Perform an undo action */
  undo: () => T;
  /** Returns true when redo can be done */
  canRedo: () => boolean;
  /** Perform a redo action */
  redo: () => T;
}

/**
 * A helper function to support undo and redo.
 *
 * @param initialValue Initial value to initialize the internal buffer
 * @param limit Amount of times you can undo
 */
export const undoRedo = <T>(
  initialValue: T,
  limit = 10,
  canUndoChanged?: (state: boolean) => void,
  canRedoChanged?: (state: boolean) => void
): IUndoRedo<T> => {
  /** Points to the first field in the buffer that contains text */
  let index = 0;
  const buffer = [initialValue] as T[];
  let couldUndo = false;
  let couldRedo = false;

  /** Remove elements above the current position index */
  const truncate = () => {
    while (buffer.length > limit) {
      buffer.shift();
    }
    buffer.length = index + 1;
  };

  const add = (item: T) => {
    truncate();
    buffer.push(item);
    index = buffer.length - 1;
    signalChanges();
  };

  const reset = (init: T) => {
    index = 0;
    buffer.length = 0;
    buffer.push(init);
  };

  const canUndo = () => index > 0;

  const undo = () => {
    if (canUndo()) {
      index--;
    }
    signalChanges();
    return buffer[index];
  };

  const canRedo = () => index < buffer.length - 1;

  const redo = () => {
    if (canRedo()) {
      index++;
    }
    signalChanges();
    return buffer[index];
  };

  const signalChanges = () => {
    console.table(buffer[index]);
    if (canUndoChanged && couldUndo !== canUndo()) {
      couldUndo = canUndo();
      canUndoChanged(couldUndo);
    }
    if (canRedoChanged && couldRedo !== canRedo()) {
      couldRedo = canRedo();
      canRedoChanged(couldRedo);
    }
  };

  return {
    reset,
    add,
    canUndo,
    undo,
    canRedo,
    redo,
  };
};
