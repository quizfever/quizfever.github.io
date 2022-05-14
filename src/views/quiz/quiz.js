import {html, until} from '../../lib.js';
import {getQuizById, getQuestionsByQuizId} from '../../api/data.js';
import { cube } from '../common/loader.js';

const quizTemplate = (quiz, questions, currentQuestionIndex) => html`
<section id="quiz">
    <header class="pad-large">
        <h1>${quiz.title}: Question ${currentQuestionIndex + 1} / ${questions.length}</h1>
        <nav class="layout q-control">
            <span class="block">Question index</span>
            ${questions.map((q, i) => 
                html`<a class="q-index q-current q-answered" href="/quiz/${quiz.objectId}?question=${i+1}"></a>`)} 
        </nav>
    </header>
    <div class="pad-large alt-page">

        <article class="question">
            <p class="q-text">
                ${questions[currentQuestionIndex].text}
            </p>

            <form>
                ${questions.map((q, i) => questionTemplate(q, i, i == currentQuestionIndex))}
            </form>

            <nav class="q-control">
                <span class="block">12 questions remaining</span>
                <a class="action" href=#><i class="fas fa-arrow-left"></i> Previous</a>
                <a class="action" href=#><i class="fas fa-sync-alt"></i> Start over</a>
                <div class="right-col">
                    <a class="action" href=#>Next <i class="fas fa-arrow-right"></i></a>
                    <a class="action" href=#>Submit answers</a>
                </div>
            </nav>
        </article>

    </div>
</section>`;

const questionTemplate = (question, questionIndex, isCurrent) => html`
<div data-index="question-${questionIndex}" style=${isCurrent ? '' : 'display:none'}>
    ${question.answers.map((answ, indexAnswers) => answerTemplate(questionIndex, indexAnswers, answ))}
</div>`;

const answerTemplate = (questionIndex, indexAnswers, text) => html`
<label class="q-answer radio">
    <input class="input" type="radio" name="question-${questionIndex}" value=${indexAnswers} />
    <i class="fas fa-check-circle"></i>
    ${text}
</label>`;

export async function quizPage(ctx) {
    const index = Number(ctx.querystring.split('=')[1] || 1) - 1; //if not querystring, we accept the question is the first
    const quizId = ctx.params.id;
    ctx.renderProp(until(getQuiz(quizId, index), cube()))
}

async function getQuiz(quizId, index) {
    const quiz = await getQuizById(quizId);
    const ownerId = quiz.owner.objectId;
    const questions = await getQuestionsByQuizId(quizId, ownerId);

    return quizTemplate(quiz, questions, index); //we start with current question index 0
}