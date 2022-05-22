import { html, render } from '../../lib.js';
import { createQuestion } from './question.js';
import { deleteQuestion } from "../../api/data.js";

const questionList = (questions, addQuestion) => html`
<header class="pad-large">
    <h2>Questions</h2>
</header>

${questions}

<article class="editor-question">
    <div class="editor-input">
        <button @click=${addQuestion} class="input submit action">
            <i class="fas fa-plus-circle"></i>
            Add question
        </button>
    </div>
</article>`;

export function createList(quizId, questions, updateCount) {
    const currentQuestions = questions.map(q => createQuestion(quizId, q, removeQuestion, updateCount));

    const element = document.createElement('div');
    element.className = 'pad-large alt-page';

    update();

    return element;

    function addQuestion() {
        //we work with the original and with the copy of questions
        questions.push({
            text: '',
            answers: [],
            correctIndex: 0
        });

        currentQuestions.push(createQuestion(quizId, {
            text: '',
            answers: [],
            correctIndex: 0
        },
        removeQuestion, updateCount, true));
        update();
    }

    //prerending by giving a new correct/updated index to each of the questions
    function update() {
        render(questionList(currentQuestions.map((q, i) => q(i)), addQuestion), element);
    }

    async function removeQuestion(indexToRemoveQuestion, id) {
        // console.log('deleted question', indexToRemoveQuestion);       
        const confirmed = confirm('Are you sure you want to delete this question?');
        if (confirmed) {
            //if question saved in the Back4Up database, then remove it off the database
            if (id) {
                await deleteQuestion(id);
                updateCount(-1); //here we deduct the number of questions ==== what is in the database
            }

            //we work with the original and with the copy of questions
            questions.splice(indexToRemoveQuestion, 1);
            currentQuestions.splice(indexToRemoveQuestion, 1);
            update();
        }
    }
}