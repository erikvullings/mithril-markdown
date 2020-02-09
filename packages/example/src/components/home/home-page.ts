import { dashboardSvc } from '../../services/dashboard-service';
import m from 'mithril';
import { CodeBlock } from 'mithril-materialized';

export const HomePage = () => ({
  view: () =>
    m('.row', [
      m(
        '.col.s12.m7.l8',
        m('.introduction', [
          m('h2', 'About mithril-markdown'),
          m('p', [
            `A component for Mithril to edit markdown content. See the `,
            m(m.route.Link, { href: '#/markdown-editor' }, 'example.'),
          ]),
          m('p', [
            'You can check out the API documentation ',
            m('a[href="https://erikvullings.github.io/mithril-markdown/typedoc/index.html"]', 'here'),
            '.',
          ]),
          m('h3', 'Installation'),
          m('p', 'First, you need to install the required packages:'),
          m(CodeBlock, {
            language: 'console',
            code: `npm i mithril mithril-markdown
# Also install the typings if you use TypeScript
npm i --save-dev @types/mithril`,
          }),
          m('p', 'Next, you can use them inside your application:'),
          m(CodeBlock, {
            code: `import { MarkdownEditor } from 'mithril-markdown';`,
          }),
        ])
      ),
      m('.col.s12.m5.l4', [
        m('h1', 'Contents'),
        m('ul.collection', [
          dashboardSvc
            .getList()
            .filter(d => d.visible && !d.default)
            .map(d => m('li.collection-item', m(m.route.Link, { href: '#' + d.route }, d.title))),
        ]),
      ]),
    ]),
});
