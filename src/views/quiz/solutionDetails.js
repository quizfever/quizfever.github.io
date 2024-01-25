
import { html } from '../../lib.js';

const resultDetailsTemplate = (quiz, result, updateCurrentPage, clearCacheQuiz) => html`
<section id="summary">
    <div class="hero layout">
        <article class="details glass">
            <h1>Quiz Results</h1>
            <h2>Quiz title: ${quiz.title}</h2>
            <div class="summary summary-top">
                ${result.percent}%
            </div>
            <div class="summary">
                ${result.numberCorrectAnswers}/${result.totalQuestions} correct answers
            </div>
        </article>
    </div>
    <a @click=${updateCurrentPage} class="action cta" href="javascript:void(0)">
        <i class="fas fa-clipboard-list"></i>
        Toggle Show/Hide detailed results
    </a>
    <a @click=${clearCacheQuiz} class="action cta" href="javascript:void(0)">
        Close the quiz results - Important!!
    </a>
</section>


<div class="pad-large alt-page">
    ${result.questions.map((q, i) => previewAQuestionTemplate(q, i + 1))}
</div>`;

const previewAQuestionTemplate = (question, nextQuestionIndex) => {
    if (question.userAnswerIndex == question.correctIndex) { //correct answer by the user
        debugger;
        if (question.revealed == false) {
            return html`
            <article class="preview">
                <span class="s-correct">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-check"></i>
                </span>
                <div class="right-col">
                    <button class="action">See question</button>
                </div>
            </article>`;
        } else if (question.revealed == true) {
            debugger;
            return html`
            <article class="preview">
                <span class="s-correct">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-check"></i>
                </span>
                <div class="right-col">
                    <button class="action">Close</button>
                </div>
                <div>
                    <p>
                        ${question.text}
                    </p>
                    ${question.answers.map((ans, IndAsn) => renderAnswersCorrectQuestion(ans, IndAsn, question))}
                </div>
            </article>`;
        }
    } else {  //wrong answer by the user
        if (question.revealed == false) {
            // debugger;
            return html`
            <article class="preview">
                <span class="s-incorrect">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-times"></i>
                </span>
                <div class="right-col">
                    <button class="action">Reveal answer</button>
                </div>
            </article>`;
        } else if (question.revealed == true) {
            debugger;
            return html`
            <article class="preview">
                <span class="s-incorrect">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-times"></i>
                </span>
                <div class="right-col">
                    <button class="action">Close</button>
                </div>
                <div>
                    <p>
                        ${question.text}
                    </p>
                    ${question.answers.map((ans, IndAsn) => renderAnswersWrongQuestion(ans, IndAsn, question))}
                </div>
            </article>`;
        }
    }
}

//users answer == incorrect
const renderAnswersWrongQuestion = (ans, IndAsn, question) => {
    if (IndAsn == question.userAnswerIndex) {
        return html`
            <div class="s-answer">
                <span class="s-incorrect">
                    This is answer ${IndAsn + 1}: ${ans}
                    <i class="fas fa-times"></i>
                    <strong>Your choice</strong>
                </span>
            </div>`;
    } else if (IndAsn == question.correctIndex) {
        return html`
            <div class="s-answer">
                <span class="s-correct">
                    This is answer ${IndAsn + 1}: ${ans}
                    <i class="fas fa-check"></i>
                    <strong>Correct answer</strong>
                </span>
            </div>`;
    } else {
        //this answer is neither userAnswer, nor is the correct answer
        return html`
            <div class="s-answer">
                <span>
                    This is answer ${IndAsn + 1}: ${ans}
                </span>
            </div>`;
    }
}

//users answer == correct
const renderAnswersCorrectQuestion = (ans, IndAsn, question) => {
    if (IndAsn == question.userAnswerIndex) { //users answer
        return html`
            <div class="s-answer">
                <span class="s-correct">
                    This is answer ${IndAsn + 1}: ${ans}
                    <i class="fas fa-check"></i>
                    <strong>Your choice</strong>
                </span>
            </div>`;
    } else {
        //this answer is neither userAnswer, nor is the correct answer
        return html`
            <div class="s-answer">
                <span>
                    This is answer ${IndAsn + 1}: ${ans}
                </span>
            </div>`;
    }
};


export async function showSolutionDetailsPage(ctx) {
    // console.log(ctx);
    // debugger;
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    const numberCorrectAnswers = ctx.quiz.numberCorrectAnswers;
    if (questions[0].revealed == undefined) {
        for (let i = 0; i < questions.length; i++) {
            questions[i].userAnswerIndex = answers[i];
            questions[i].revealed = false;
        }
    }
    // debugger;


    function updateCurrentPage() {
        // debugger;
        if (questions[0].revealed == false) {
            for (let i = 0; i < questions.length; i++) {
                questions[i].revealed = true;
            }
        } else if (questions[0].revealed == true) {
            for (let i = 0; i < questions.length; i++) {
                questions[i].revealed = false;
            }
        }
        ctx.page.redirect('/solution-details/' + ctx.quiz.objectId);
    }

    //Important function - maybe a button to make for clearing the cache[quizId]
    function clearCacheQuiz() {
        ctx.clearCache(ctx.quiz.objectId);
        ctx.page.redirect('/');
    }

    ctx.renderProp(resultDetailsTemplate(ctx.quiz, {
        percent: (numberCorrectAnswers / questions.length * 100).toFixed(0),
        numberCorrectAnswers,
        totalQuestions: questions.length,
        questions
    },
        updateCurrentPage, clearCacheQuiz));
}

