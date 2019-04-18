# mithril-markdown

Mithril component for a div with editable contents. It is loosely inspired by [react-contenteditable](https://github.com/lovasoa/react-contenteditable) and [Tania Rascia's content-editable tutorial](https://www.taniarascia.com/content-editable-elements-in-javascript-react).

## Installation

Pull it from [npm](https://www.npmjs.com/package/mithril-markdown).

```bash
npm i mithril mithril-markdown
# Also install the typings if you use TypeScript
npm i --save-dev @types/mithril
```

## Playground

There is a small [playground](https://flems.io/#0=N4IgtglgJlA2CmIBcBWADAOgEwBoQDMIEBnZAbVADsBDMRJEDACwBcxYQ8BjAe0pfj9kIEAF8cVWvUYArUtz4ChDAMKLBLAKJQILagCMEAAgC8RgBQBKUwD4jwADqUjR3pWIsjH6gNP3RANxOLgD0AFRhRpqQnixM8K5M1JQA5gksPEZxCQCuxPAAThhGYSHBrnweRvAxKkmpCWbmPAUQKRA0sJoAbiw4rgjJOQAOABJssNYmdo7OLkYQ+BZcg5Qj4+ymJmbdPNBGaNaz8-Mr8ENjE3741LD5QXMuouUublVQPGB+3gIYH2A4F7zPhceppb56X4gsHwQGPeawageDawCE+eAYRHIiYPE5vTysTZmM4XFFGAD8WVaYAAysNqFx4MRzP8MB1KIVRgAVACyABlrEgjKz2ZzeXzcfNFhZoclwQAyeVGQmogCE2yMWJYKKOQNCISMKlgfAS8G6GiMAHddEwjAB5fQyeBcFgYJHENrODJGai7aB6owhA0OEAqZKUHied2erKZArnKBGPiwACeRmGBR4w0KLDTAHI9AU0iw80mljxHc6WCGA-jqr0-A6nS63cQPSlKOZgOIk612p0en17AGXIXi0Ljicp91bjl4EKVXCp-NxAHRJZJSdZQ1zIv6ywN0DnvCfhitWSzCrJYFyuFIgAlGo8c0+2Co7n8ir8C2W+LOekeB0KT9MkibxnoHRJpQqZZPE6aIpBAgAB6uiUZRzHWAECAACghlBcvAKF+GaFrTMO8IkfwGAZpRLAACLwDcOSwCwVibl+VTIZ4Zi0RgKwQMM+g8NQBRQHRPjUEYir1hofGwAJQkiWJEkYMW4l6OYBaESwITDHheaHvCHxcDkdBUYRzpqGAYCgZpHT5AU2rinm-Q3HcsJZNpRgAD7eUYeYGdekp3oaqxGCMRgfnyX5KJ4pTlHWLDUnSDJMt8theAGGDxnpqXmCE8qUPoxDDAEITAf5BlZTliKMvl8q0KV5X9Hm8pVfCLjZfAuV1QVKQsGVFV5jY7XLl1PXwPVLGDS1AA8gVOLeERGHREDEAYxgaIUQE+kYHKWpqHQJPFGGVJ4OjrYY8AAHLwJa8kcsQxHmvwGWTq8Z1GAA1vAKZqFAjQyVRP1-TwAM+X5vG-hAoLsdK5gg-9jQagAjAAzLqHVA664E5AUlAAGqzoDbn3AG8O8TRL30Yx1DMQe5HLi4lPxtTDFMSxbFrke5Q3qd7iePkCAugAgm+fhWG9QL5CwXIQHQPA5Kxktke98zGaZskWVwVk2ZQUCaULVZi7ALlGKT8CGScPaHEF5S4-jjPApQXDxuiQpdsKnwgSwSXEBOUGgnKCSiEY65S1jp4YNu4JmDH8DsS4Uf-H4-zsau8LdBAd0e2rLg+H7E4jsqExLkzegpNdUh+HmOjdC5xcXRt8CJmYFtl8uWHwCLxC4dQHQEURZhJXOHdTiSayXESVKj8XVMaLd91HX4I+wsXRui2+dqUAAYjwJlPcPBSz1jLjx2PJwYFfGZZsQa5j+HqsBg7zhgOYxcV1XdAX-MedTlf1FMzDGID-PE6hvw6D0FdIUqom5XSgKA52+B955CFBvFgJtt57wPhSLw8BhYYPFkKHI+tGJHQQcXM+lAOjDCVkKGoug6jB0QVQwweMPaWwygwlgTCdweQnusCYlgWFQS7kKLuPc+4Dy8pSLuUj8JeWIaQwgHIKGn2diDGibZxGswXndB6CRKRwIQIvAxT0lEAxUS3RBGcmZGDABgEeHhdxCIDFbFcZc+Z8ycHWEWwxhgSymDMBKn1Tx+DViqIUeZZr6BsNoXQ9j4CzRCLEvMvNyj23gCwPGzg1ZZxzhYboEYAZBKdicF+RgyDFzfnmJgKMzZ5hiEwVosAAC0bhYot10M3AyiCanDAaSLIwPIbQtIqGAYYJpXrIIKLtOuVobTVEgc3GKGhiAYF6dU8wahvz8HiVAhA-Q-4nEiV4SEGJFyUMDAaR82T8ZPWyOFYYUB0SJiihUAGVz44LiuE-dRJwo4qj8FeK5H13A8AQJiHgKQXHsHcXY2xdjrlRCQo1Yw3p56vUeXkQo5tMxfC2q0VI4ybJ33+VBEGHxLSUHoRHJFUoljmAxCDLYZgXIGTKfS6ogDaLszppzeFSLjz0sRXYoMRhHwTVggkfQSJ0jUAqtKDkLcW5XM-lIKJdcG7kvFQAITTJY-lQ4GoTICNUFgXAfTxiMDVVKiZ9BpmyBAWZEYCg2VRLwEhAgCj0kclaP8moeA8A9MS5BB8MBXPFQIqesAhTt0jQafVwpab036B8SgBZXzGgOtihysZqjfhdfoo6ZL6XisxSwUxR0423HyCIvVBqU0sX6OgrNnkiK-kENK6oCAzKeHjIyCA5onphryAmvBBDMG7xQf7c2ta146sTY2jmQ5O3-iRCwHaXF+jxjAM+BItx3zih9Prb68BurdtyohbSEbF3pg3d3XueFB4sBre5Gxwitl5gGf0Kp5K8x71mXu61HQZk2U3XwfoLRzbQfsnoN8O0ElZ0kpQYYAJEjOi+kmJW9i0w5UyHwfyIianUDNsAIwoLlTxnwFE1gLBgFICDO0OIOR9B8U+CEbaX1ujMQeikYgIQmktPaeAgQyyrraq5VkES45-IAH1DDJC+pJoVLUADiuhRisc2f+jZxcAC6n6sb6Z5nMLxi1KAOL3V6lkKC+0YCElAFM-Q-HDA3JwEA6CICVGEAADhQEgNAYgJAgBoHQYQfE2weY6RoYQYh9N4Ael9UgSAKChakMIITRAPN4w4AwOjDGgwkOGF9FI7GwCCdGUQAAAijDAdWABslW4gtIwHIDzuZszCGIK7ASLB4uiCAA) on [flems.io](https://flems.io).

## Usage example

```ts
import { ContentEditable } from 'mithril-markdown';
import m from 'mithril';

...

    m(ContentEditable, {
      // Original HTML input
      html: state.html,
      // Returns the updated HTML code
      onchange: html => {
        state.html = html;
        console.log(html);
      },
      // Example to prevent the user from entering commas
      onkeydown: e => {
        if (e.key === ',') {
          e.preventDefault();
        }
      },
      // Replace the base tag, if needed
      tagName: 'div',
      // By default, &amp; etc are replaced by their normal counterpart when losing focus.
      // cleanupHtml: false,
      // By default, don't allow the user to enter newlines
      // preventNewline: false,
      // By default, select all text when the element receives focus
      // selectAllOnFocus: false,
      // By default, when pasting text, remove all HTML and keep the plain text.
      // pasteAsPlainText: false,
    })

```

## Build instructions

Using `pnpm` (`npm i -g pnpm`), run the following commands:

```bash
pnpm m i
npm start
```
