import { html, until } from '../lib.js';
import { getQuizesByTopicTitle } from '../api/data.js';
import { cube } from './common/loader.js';
import { quizTemplate } from './common/quiz-preview.js';

const templateSearchQuizes = (searchText) => html`
<section id="browse">
    <header class="pad-large">
        <h1>Search results</h1>
    </header>

    ${until(loadSearchedByTitleQuizes(searchText), cube())}
</section>`;


async function loadSearchedByTitleQuizes(topicTitle) {
    const quizes = await getQuizesByTopicTitle(topicTitle);
    
    if (quizes) {
        return html`
        <div class="pad-large alt-page">
            ${quizes.map(qz => quizTemplate(qz))}
        </div>`;
    } 
    else {
        return html`<div class="pad-large alt-page">No quizes found by the searched quiz title</div>`;
    }
}


export async function browseSearchedQuizesPage(ctx) {
    const searchPartOfTitle = ctx.params.searchText.trim();
    ctx.renderProp(templateSearchQuizes(searchPartOfTitle));  
}