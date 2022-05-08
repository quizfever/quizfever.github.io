//debuggin http requests
import * as api from './api/data.js';
window.api = api; 

import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js';

const root = document.getElementById('content');

page(decorateContext)
page('/', editorPage);

page.start();

function decorateContext(ctx, next) {
    ctx.renderProp = (content) => render(content, root);
    next();
}