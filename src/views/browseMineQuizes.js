import { html, until } from '../lib.js';
import { getMyQuizes } from '../api/data.js';
import { cube } from './common/loader.js';
import { quizTemplate } from './common/quiz-preview.js';
import { getUserData } from '../util.js';

const templateMyQuizes = (userId) => html`
<section id="browse">
    <header class="pad-large">
        ${'' /*
        <form class="browse-filter">
            <input class="input" type="text" name="query">
            <select class="input" name="topic">
                <option value="all">All Categories</option>
                ${Object.entries(topics).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
            </select>
            <input class="input submit action" type="submit" value="Filter Quizes">
        </form>
        */}
        <h1>My quizes (I have created)</h1>
    </header>

    ${until(loadMyQuizes(userId), cube())}
</section>`;


async function loadMyQuizes(userId) {
    const quizes = await getMyQuizes(userId);

    return html`
    <div class="pad-large alt-page">
        ${quizes.map(qz => quizTemplate(qz))}
    </div>`;
}


export async function browseMineQuizesPage(ctx) {
    const userData = getUserData();
    if (userData) {
        ctx.renderProp(templateMyQuizes(userData.userId));
    }    
}