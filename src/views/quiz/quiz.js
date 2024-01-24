import { submitSolution } from '../../api/data.js';
import {html, styleMap, classMap} from '../../lib.js';
import { cube } from '../common/loader.js';

const quizTemplate = (quiz, questions, answers, currentQuestionIndex, onSelect, resetQuiz, onSubmitWithSavedData) => html`
<section id="quiz">
    <header class="pad-large">
        <h1>${quiz.title}: Question ${currentQuestionIndex + 1} / ${questions.length}</h1>
        <nav class="layout q-control">
            <span class="block">Question index</span>
            ${questions.map((q, i) => 
                indexTemplate(quiz.objectId, i, i == currentQuestionIndex, answers[i] != undefined))} 
        </nav>
    </header>
    <div class="pad-large alt-page">

        <article class="question">
            <p class="q-text">
                ${questions[currentQuestionIndex].text}
            </p>

            <form id="quiz-form" @change=${onSelect}>
                ${questions.map((q, i) => questionTemplate(q, i, i == currentQuestionIndex))}
            </form>

            <nav class="q-control">
                <span class="block">${answers.filter(a => a == undefined).length} questions reamaining to be answered</span>
                ${currentQuestionIndex > 0 
                    ? html`
                        <a class="action" href="/quiz/${quiz.objectId}?question=${currentQuestionIndex}">
                            <i class="fas fa-arrow-left"></i>
                            Previous
                        </a>`
                    : ''}


                <a @click=${resetQuiz} class="action" href="javascript:void(0)"><i class="fas fa-sync-alt"></i> Start over</a>

                <div class="right-col">
                ${currentQuestionIndex < questions.length-1
                    ? html`
                        <a class="action" href="/quiz/${quiz.objectId}?question=${currentQuestionIndex + 2}">
                            Next 
                            <i class="fas fa-arrow-right"></i>
                        </a>`
                    : ''}

                    ${(answers.filter(a => a == undefined).length == 0 || currentQuestionIndex == questions.length-1)
                        ? html`<a @click=${onSubmitWithSavedData} class="action" href="javascript:void(0)">Submit answers</a>`
                        : ''}                    

                </div>
            </nav>
        </article>

    </div>
</section>`;

const indexTemplate = (quizId, i, isCurrent, isAnswered) => {
    const className = {
        'q-index': true, //this class will be present in the attributes of the tag <a>
        'q-current': isCurrent,
        'q-answered': isAnswered
    };
    return html`<a class=${classMap(className)} href="/quiz/${quizId}?question=${i+1}"></a>`;
};

const questionTemplate = (question, questionIndex, isCurrent) => html`
<div data-index="question-${questionIndex}" style=${styleMap({display: isCurrent ? '' : 'none'})}>
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
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    update();

    function onSelect(e) {
        const questionIndex = Number(e.target.name.split("-")[1]);
        if (Number.isNaN(questionIndex) != true) {
            const answerInd = Number(e.target.value);
            answers[questionIndex] = answerInd;
            update();
        }        
    }

    function resetQuiz() {
        const confirmed = confirm('Are you sure you want to reset your answers?');
        if (confirmed) {
            ctx.clearCache(ctx.quiz.objectId);
            ctx.page.redirect('/quiz/' + ctx.quiz.objectId);
        }
    }

    async function onSubmitSolutionWithSavedData(e) {
        // console.log(answers); //the current answers of the quiz filled in by the current user
        const unanswered = answers.filter(a => a == undefined).length;
        if (unanswered > 0) {
            const confirmed = confirm(`There are ${unanswered} unanswered questions. Are you sure you will not answer them?`);
            if (confirmed == false) {
                return; //we stop the submission of the test
            }
        }

        //TODO: maybe not needed
        /* An option to keep the right and the wrong answers
        const result = [];
        for (let i = 0; i < questions.length; i++) {
            result.push({
                question: questions[i].text,
                correct: questions[i].correctIndex == answers[i]}); //each question its correct answer is it equal 
            // to the current results/answers based on the filled in quiz by the user           
        }*/

        let correctAnswers = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correctIndex === answers[i]) {//each question its correct answer is it equal to the current results/answers based on the filled in quiz by the user
                correctAnswers++;
            }         
        }

        const solution = {
            correctAnswers,
            totalQuestions: questions.length
        };

        ctx.renderProp(cube());
        await submitSolution(ctx.quiz.objectId, solution);
        ctx.page.redirect('/summary/' + ctx.quiz.objectId);
    }

    function update() {
        ctx.renderProp(quizTemplate(ctx.quiz, questions, answers, index, onSelect, resetQuiz, onSubmitSolutionWithSavedData));
    }
}