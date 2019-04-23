import { boldIcon, italicsIcon, strikethroughIcon, codeIcon, unorderedIcon, orderedIcon, quoteIcon } from './assets';

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
}

const boldCommandConfig = {
  name: 'Bold',
  shortcut: 'CTRL+B',
  icon: boldIcon,
  detect: /\*\*(\S.*?\S)\*\*/i,
  multiline: false,
  on: [/(.+)/gi, '**$1**'],
  off: [/\*\*(\S.*?\S)\*\*/gi, '$1'],
} as ICommandConfig;

const italicsCommandConfig = {
  name: 'Italics',
  shortcut: 'CTRL+I',
  icon: italicsIcon,
  detect: /\*(\S.*?\S)\*(?!=\*)/i,
  multiline: false,
  on: [/(.+)/gi, '*$1*'],
  off: [/\*(\S.*?\S)\*/gi, '$1'],
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
} as ICommandConfig;

const codeInlineCommandConfig = {
  name: 'Code inline',
  icon: codeIcon,
  detect: /^```\r?\n[\S\s]+\r?\n```\s*$/i,
  multiline: true,
  merge: true,
  on: [/((?:\S|\s)+)/gi, '```\n$1\n```'],
  off: [/^```\r?\n([\S\s]+)\r?\n```\s*$/gi, '$1'],
} as ICommandConfig;

const unorderedListCommandConfig = {
  name: 'Unordered list',
  icon: unorderedIcon,
  shortcut: 'CTRL+U',
  detect: /(^|\n)-\s+(.+)\s*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)\s*(.+?)\s*(?=$|\n)/gi, '$1- $2'],
  off: [/(^|\n)-\s+(.+)\s*(?=$|\n)/gi, '$1$2'],
} as ICommandConfig;

const orderedListCommandConfig = {
  name: 'Ordered list',
  icon: orderedIcon,
  shortcut: 'CTRL+O',
  detect: /(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)\s*(.+?)\s*(?=$|\n)/gi, '$11. $2'],
  off: [/(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/gi, '$1$2'],
} as ICommandConfig;

const blockQuoteCommandConfig = {
  name: 'Block quote',
  icon: quoteIcon,
  shortcut: 'CTRL+Q',
  detect: /(^|\n)>[^\S\n]*(.*?)[^\S\n]*(?=$|\n)/i,
  multiline: true,
  on: [/(^|\n)[^\S\n]*(.*?)[^\S\n]*(?=$|\n)/gi, '$1> $2'],
  off: [/(^|\n)>[^\S\n]+(.*?)[^\S\n]*(?=$|\n)/gi, '$1$2'],
} as ICommandConfig;

export const commands = [
  boldCommandConfig,
  italicsCommandConfig,
  // underlineCommandConfig,
  // markCommandConfig,
  // superscriptCommandConfig,
  // subscriptCommandConfig,
  strikethroughCommandConfig,
  codeInlineCommandConfig,
  unorderedListCommandConfig,
  orderedListCommandConfig,
  blockQuoteCommandConfig,
];
