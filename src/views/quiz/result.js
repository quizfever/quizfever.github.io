import { html } from '../../lib.js';

const resultTemplate = (quiz, result) => html`
<section id="summary">
    <div class="hero layout">
        <article class="details glass">
            <h1>Quiz Results</h1>
            <h2>${quiz.title}</h2>

            <div class="summary summary-top">
                ${result.percent}%
            </div>

            <div class="summary">
            ${result.correctAnswers}/${result.totalQuestions} correct answers
            </div>

            <a class="action cta" href="#"><i class="fas fa-sync-alt"></i> Retake Quiz</a>
            <a class="action cta" href="#"><i class="fas fa-clipboard-list"></i> See Details</a>

        </article>
    </div>

    <div class="pad-large alt-page">
        <article class="preview">
            <span class="s-correct">
                Question 1
                <i class="fas fa-check"></i>
            </span>
            <div class="right-col">
                <button class="action">See question</button>
            </div>
        </article>

        <article class="preview">
            <span class="s-correct">
                Question 2
                <i class="fas fa-check"></i>
            </span>
            <div class="right-col">
                <button class="action">See question</button>
            </div>
        </article>

        <article class="preview">
            <span class="s-incorrect">
                Question 3
                <i class="fas fa-times"></i>
            </span>
            <div class="right-col">
                <button class="action">Reveal answer</button>
            </div>
        </article>

        <article class="preview">
            <span class="s-incorrect">
                Question 4
                <i class="fas fa-times"></i>
            </span>
            <div class="right-col">
                <button class="action">Close</button>
            </div>

            <div>
                <p>
                    This is the first question. Veniam unde beatae est ab quisquam quos officia, eius
                    harum accusamus adipisci?
                </p>
                <div class="s-answer">
                    <span class="s-incorrect">
                        This is answer 1
                        <i class="fas fa-times"></i>
                        <strong>Your choice</strong>
                    </span>
                </div>
                <div class="s-answer">
                    <span class="s-correct">
                        This is answer 2
                        <i class="fas fa-check"></i>
                        <strong>Correct answer</strong>
                    </span>
                </div>
                <div class="s-answer">
                    <span>
                        This is answer 3
                    </span>
                </div>
        </article>
    </div>

</section>`;

export async function resultPage(ctx) {
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    const correctAnswers = answers.reduce((res, curr, indx) => res + Number(questions[indx].correctIndex == curr), 0);
    
    ctx.renderProp(resultTemplate(ctx.quiz, {
        percent: (correctAnswers / questions.length * 100).toFixed(0),
        correctAnswers,
        totalQuestions: questions.length
    }));
}