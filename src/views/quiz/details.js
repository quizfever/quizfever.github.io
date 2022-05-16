import { html, topics, until } from '../../lib.js';

import { getSolutionCount } from '../../api/data.js';
import { line } from '../common/loader.js';
import { getUserData } from '../../util.js';

const detailsTemplate = (quiz) => html`
<section id="details">
    <div class="pad-large alt-page">
        <article class="details">
            <h1>${quiz.title}</h1>
            <span class="quiz-topic">A quiz by <a href="/users/${quiz.owner.objectId}">${quiz.owner.username}</a> on the topic of <strong>${topics[quiz.topic]}</strong></span>
            ${until(loadCount(quiz), line())}
            <p class="quiz-desc">${quiz.description}</p>

            <div>
                ${beginOrEditQuiz(quiz)}
                
            </div>

        </article>
    </div>
</section>`;

function beginOrEditQuiz(quiz) {
    const userData = getUserData();
    let resultHtml = '';
    if (userData) {
        resultHtml = html`
            <a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>

            ${quiz.owner.objectId == userData.userId 
                    ? html`<a class="cta action" href="/edit/${quiz.objectId}">Edit Quiz</a>`
                    : ''}
                `;            
    } else {
        resultHtml = html`<a class="cta action" href="/login">Begin Quiz after log In/Up</a>`
        alert('You should log in/up in order to start solving a quiz!');
    }
    return resultHtml;
}


async function loadCount(quiz) {
    const taken = (await getSolutionCount([quiz.objectId]))[quiz.objectId] || 0;

    return html`
    <div class="quiz-meta">
        <span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' : 's'}</span>
        <span>|</span>
        <span>Taken ${taken} time${taken == 1 ? '' : 's'}</span>
    </div>`;
}

export async function detailsPage(ctx) {
    ctx.renderProp(detailsTemplate(ctx.quiz));
}