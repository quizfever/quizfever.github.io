import { html } from '../../lib.js';

const resultTemplate = (quiz, result, onRestartQuiz, showDetailedResultFromQuiz) => html`
<section id="summary">
    <div class="hero layout">
        <article class="details glass">
            <h1>Quiz Results</h1>
            <h2>${quiz.title}</h2>

            <div class="summary summary-top">
                ${result.percent}%
            </div>

            <div class="summary">
                ${result.numberCorrectAnswers}/${result.totalQuestions} correct answers
            </div>

            <a @click=${onRestartQuiz} class="action cta" href="javascript:void(0)">
                <i class="fas fa-sync-alt"></i>
                Retake Quiz
            </a>
            <a @click=${showDetailedResultFromQuiz} class="action cta" href="javascript:void(0)">
                <i class="fas fa-clipboard-list"></i> 
                See Details
            </a>
            <a class="action cta" href="/">
                <i class="fas fa-clipboard-list"></i> 
                Close the quiz result
            </a>
        </article>
    </div>
</section>`;

export async function resultPage(ctx) {
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    const numberCorrectAnswers = answers.reduce((res, curr, indx) => res + Number(questions[indx].correctIndex == curr), 0);
    ctx.quiz.numberCorrectAnswers = numberCorrectAnswers;

    ctx.renderProp(resultTemplate(ctx.quiz, {
        percent: (numberCorrectAnswers / questions.length * 100).toFixed(0),
        numberCorrectAnswers: numberCorrectAnswers,
        totalQuestions: questions.length
    },
        onRestartQuiz,
        showDetailedResultFromQuiz));

    function onRestartQuiz() {
        const confirmed = confirm('Are you sure you want to make the Quiz again?');
        if (confirmed) {
            ctx.clearCache(ctx.quiz.objectId);
            ctx.page.redirect('/quiz/' + ctx.quiz.objectId);
        }
    }

    function showDetailedResultFromQuiz() {
        ctx.page.redirect('/solution-details/' + ctx.quiz.objectId);
    }
}



