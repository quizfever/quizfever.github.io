
/* Сменя им се на всички въпроси статуса / revealed от false на true и обратното. А аз искам поотделно, и не знам как става

import { html } from '../../lib.js';

const resultDetailsTemplate = (quiz, result, updateCurrentPage) => html`
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
        </article>
    </div>
</section>

<button @click=${updateCurrentPage} class="pad-large alt-page">Toggle Show/Hide detailed results</button>

<div class="pad-large alt-page">
    ${result.questions.map((q, i) => previewAQuestionTemplate(q, i + 1, updateCurrentPage))}
</div>`;

const previewAQuestionTemplate = (question, nextQuestionIndex, updateCurrentPage) => {
    if (question.userAnswerIndex == question.correctIndex) { //correct answer by the user
        if (question.revealed == false) {
            return html`
            <article class="preview">
                <span class="s-correct">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-check"></i>
                </span>
                <div class="right-col">
                    <button @click=${(question.revealed=question.revealed==false ? true : false) && updateCurrentPage}
                        class="action">See question</button>
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
                    <button @click=${(question.revealed=question.revealed==false ? true : false) && updateCurrentPage}
                        class="action">Close</button>
                </div>
                <div>
                    <p>
                        ${question.text}
                    </p>
                    ${question.answers.map((ans, IndAsn) => renderAnswersOneQuestion(ans, IndAsn, question))}
                </div>
            </article>`;
        }
    } else {  //wrong answer by the user
        debugger;
        if (question.revealed == false) {
            return html`
            <article class="preview">
                <span class="s-incorrect">
                    Question ${nextQuestionIndex}
                    <i class="fas fa-times"></i>
                </span>
                <div class="right-col">
                    <button @click=${(question.revealed=question.revealed==false ? true : false) && updateCurrentPage}
                        class="action">Reveal answer</button>
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
                    <button @click=${(question.revealed=question.revealed==false ? true : false) && updateCurrentPage}
                        class="action">Close</button>
                </div>
                <div>
                    <p>
                        ${question.text}
                    </p>
                    ${question.answers.map((ans, IndAsn) => renderAnswersOneQuestion(ans, IndAsn, question))}
                </div>
            </article>`;
        }
    }
}

const renderAnswersOneQuestion = (ans, IndAsn, question) => {
    if (IndAsn == question.userAnswerIndex) { //users answer
        if (question.correctIndex == question.userAnswerIndex) { //user's anwser is correct
            return html`
            <div class="s-answer">
                <span class="s-correct">
                    This is answer ${IndAsn + 1}: ${ans}
                    <i class="fas fa-check"></i>
                    <strong>Your choice</strong>
                </span>
            </div>`;
        } else { //user's anwser is incorrect
            return html`
            <div class="s-answer">
                <span class="s-incorrect">
                    This is answer ${IndAsn + 1}: ${ans}
                    <i class="fas fa-times"></i>
                    <strong>Your choice</strong>
                </span>
            </div>`;
        }
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
};


export async function showSolutionDetailsPage(ctx) {
    console.log(ctx);
    debugger;
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    const numberCorrectAnswers = ctx.quiz.numberCorrectAnswers;
    if (questions[0].revealed == undefined) {
        for (let i = 0; i < questions.length; i++) {
            questions[i].userAnswerIndex = answers[i];
            questions[i].revealed = false;
        }
    }




    function updateCurrentPage() {
        // debugger;
        // q.revealed = q.revealed == false ? true : false;
        ctx.page.redirect('/solution-details/' + ctx.quiz.objectId);
    }

    ctx.renderProp(resultDetailsTemplate(ctx.quiz, {
        percent: (numberCorrectAnswers / questions.length * 100).toFixed(0),
        numberCorrectAnswers,
        totalQuestions: questions.length,
        questions
    },
        updateCurrentPage));
}*/
