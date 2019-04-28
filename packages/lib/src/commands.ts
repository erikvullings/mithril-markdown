import {
  boldIcon,
  italicsIcon,
  strikethroughIcon,
  codeIcon,
  unorderedIcon,
  orderedIcon,
  quoteIcon,
  inlineCodeIcon,
  linkIcon,
  imageIcon,
} from './assets';

/**
 * Commands for processing the markdown files using RegExp.
 *
 * Source of the commands:
 * @see https://github.com/qjebbs/vscode-markdown-extended/blob/master/src/commands/toggleFormats.ts
 */
export interface ICommandConfig {
  /** Name of the command */
  name: string;
  /** SVG icon representing the command */
  icon: string;
  /** Shortcut key, e.g. CTRL+B for bold. Has to start with CTRL+, uppercase */
  shortcut: string;
  /** Detection function, to detect if the command has already been applied */
  detect: RegExp;
  /** If true, works on whole lines, otherwise command is word based */
  multiline: boolean;
  /** If true, multiple lines are merged first, so they are treated as one */
  merge?: boolean;
  /** Turn the desired command effect on, based on a RegExp and a replacement string */
  on: [RegExp, string];
  /** Turn the desired command effect off, based on a RegExp and a replacement string */
  off: [RegExp, string];
  /**
   * SelectionStart and SelectionEnd offset, used to extend or shrink the selection range
   * for on state. The off state is on state * -1.
   * E.g. [0, 4] means that the selectionStart remains the same, but the selectionEnd is increased by 4.
   */
  offsets: [number, number];
}

const boldCommandConfig = {
  name: 'Bold',
  shortcut: 'CTRL+B',
  icon: boldIcon,
  detect: /\*\*(\S.*?\S)\*\*/i,
  multiline: false,
  on: [/(.+)/gi, '**$1**'],
  off: [/\*\*(\S.*?\S)\*\*/gi, '$1'],
  // In on state, the whole word is selected, so the start of the selection points to **, so extend with 4
  offsets: [0, 4],
} as ICommandConfig;

const italicsCommandConfig = {
  name: 'Italics',
  shortcut: 'CTRL+I',
  icon: italicsIcon,
  detect: /\*(\S.*?\S)\*(?!=\*)/i,
  multiline: false,
  on: [/(.+)/gi, '*$1*'],
  off: [/\*(\S.*?\S)\*/gi, '$1'],
  offsets: [0, 2],
} as ICommandConfig;

const inlineCodeCommandConfig = {
  name: 'Inline code',
  shortcut: 'CTRL+E',
  icon: inlineCodeIcon,
  detect: /`(\S.*?\S)`(?!=`)/i,
  multiline: false,
  on: [/(.+)/gi, '`$1`'],
  off: [/`(\S.*?\S)`/gi, '$1'],
  offsets: [0, 2],
} as ICommandConfig;

// const underlineCommandConfig = {
//   name: 'Underline',
//   detect: /_(\S.*?\S)_/gi,
//   multiline: false,
//   on: [/(.+)/gi, '_$1_'],
//   off: [/_(\S.*?\S)_/gi, '$1'],
// } as ICommandConfig;

// const markCommandConfig = {
//   name: 'Mark',
//   detect: /==(\S.*?\S)==/gi,
//   multiline: false,
//   on: [/(.+)/gi, '==$1=='],
//   off: [/==(\S.*?\S)==/gi, '$1'],
// } as ICommandConfig;

// const superscriptCommandConfig = {
//   name: 'Superscript',
//   detect: /\^(\S.*?\S)\^/gi,
//   multiline: false,
//   on: [/(.+)/gi, '^$1^'],
//   off: [/\^(\S.*?\S)\^/gi, '$1'],
// } as ICommandConfig;

// const subscriptCommandConfig = {
//   name: 'Subscript',
//   detect: /~(\S.*?\S)~/gi,
//   multiline: false,
//   on: [/(.+)/gi, '~$1~'],
//   off: [/~(\S.*?\S)~/gi, '$1'],
// } as ICommandConfig;

const strikethroughCommandConfig = {
  name: 'Strikethrough',
  icon: strikethroughIcon,
  detect: /~~(\S.*?\S)~~/i,
  multiline: false,
  on: [/(.+)/gi, '~~$1~~'],
  off: [/~~(\S.*?\S)~~/gi, '$1'],
  offsets: [0, 4],
} as ICommandConfig;

const linkCommandConfig = {
  name: 'Link',
  shortcut: 'CTRL+L',
  icon: linkIcon,
  detect: /\[(.*?)\]\(.*\)/i,
  multiline: false,
  on: [/(.+)/gi, '[$1](http://URL "TITLE")'],
  off: [/\[(.*?)\]\(.*\)/gi, '$1'],
  offsets: [0, 22],
} as ICommandConfig;

const imageCommandConfig = {
  name: 'Image',
  shortcut: 'CTRL+P',
  icon: imageIcon,
  detect: /!\[(.*?)\]\(.*\)/i,
  multiline: false,
  on: [/(.+)/gi, '![$1](http://URL)'],
  off: [/!\[(.*?)\]\(.*\)/gi, '$1'],
  offsets: [0, 15],
} as ICommandConfig;

const codeInlineCommandConfig = {
  name: 'Code inline',
  icon: codeIcon,
  detect: /^```\r?\n[\S\s]+\r?\n```\s*$/i,
  multiline: true,
  merge: true,
  on: [/((?:\S|\s)+)/gi, '```\n$1\n```'],
  off: [/^```\r?\n([\S\s]+)\r?\n```\s*$/gi, '$1'],
  offsets: [0, 8],
} as ICommandConfig;

const unorderedListCommandConfig = {
  name: 'Unordered list',
  icon: unorderedIcon,
  shortcut: 'CTRL+U',
  detect: /(^|\n)-\s+(.+)\s*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)\s*(.+?)\s*(?=$|\n)/gi, '$1- $2'],
  off: [/(^|\n)-\s+(.+)\s*(?=$|\n)/gi, '$1$2'],
  offsets: [0, 2],
} as ICommandConfig;

const orderedListCommandConfig = {
  name: 'Ordered list',
  icon: orderedIcon,
  shortcut: 'CTRL+O',
  detect: /(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)\s*(.+?)\s*(?=$|\n)/gi, '$11. $2'],
  off: [/(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/gi, '$1$2'],
  offsets: [0, 3],
} as ICommandConfig;

const blockQuoteCommandConfig = {
  name: 'Block quote',
  icon: quoteIcon,
  shortcut: 'CTRL+Q',
  detect: /(^|\n)>[^\S\n]*(.*?)[^\S\n]*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)[^\S\n]*(.*?)[^\S\n]*(?=$|\n)/gi, '$1> $2'],
  off: [/(^|\n)>[^\S\n]+(.*?)[^\S\n]*(?=$|\n)/gi, '$1$2'],
  offsets: [0, 2],
} as ICommandConfig;

export const commands = [
  boldCommandConfig,
  italicsCommandConfig,
  inlineCodeCommandConfig,
  strikethroughCommandConfig,
  linkCommandConfig,
  imageCommandConfig,
  // underlineCommandConfig,
  // markCommandConfig,
  // superscriptCommandConfig,
  // subscriptCommandConfig,
  codeInlineCommandConfig,
  unorderedListCommandConfig,
  orderedListCommandConfig,
  blockQuoteCommandConfig,
];
