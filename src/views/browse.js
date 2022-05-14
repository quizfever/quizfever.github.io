import { html, until, topics } from '../lib.js';
import { getQuizes } from '../api/data.js';
import { cube } from '../views/common/loader.js';

const template = () => html`
<section id="browse">
    <header class="pad-large">
        <form class="browse-filter">
            <input class="input" type="text" name="query">
            <select class="input" name="topic">
                <option value="all">All Categories</option>
                ${Object.entries(topics).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
            </select>
            <input class="input submit action" type="submit" value="Filter Quizes">
        </form>
        <h1>All quizes</h1>
    </header>

    <!-- loader -->

    ${until(loadQuizes(), cube())}
</section>`;


async function loadQuizes() {
    const quizes = await getQuizes();

    return html`
    <div class="pad-large alt-page">
        ${quizes.map(quizTemplate)}
    </div>`;
}

const quizTemplate = (quiz) => html`
<article class="preview layout">
    <div class="right-col">
        <a class="action cta" href=${'/quiz/' + quiz.objectId}>View Quiz</a>
    </div>
    <div class="left-col">
        <h3><a class="quiz-title-link" href=${'/quiz/' + quiz.objectId}>${quiz.title}</a></h3>
        <span class="quiz-topic">Topic: ${quiz.topic}</span>
        <div class="quiz-meta">
            <span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' : 's'}</span>
            <span>|</span>
            <span>Taken ?** times</span>
        </div>
    </div>
</article>`;

export async function browsePage(ctx) {
    ctx.renderProp(template());
}