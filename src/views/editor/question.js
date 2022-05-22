import { html, render } from '../../lib.js';
import { createAnswerListForOneQuestion } from './answer.js';
import { createQuestion as apiCreateQuestion, updateQuestion } from '../../api/data.js';  //as the names duplicate, we make it as apiCreate
import { createOverlay } from '../common/loader.js';

const editorTemplate = (data, questionIndex, onSave, onCancel) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onSave} class="input submit action"><i class="fas fa-check-double"></i> Save</button>
        <button @click=${onCancel} class="input submit action"><i class="fas fa-times"></i> Cancel</button>
    </div>
    <h3>Question ${questionIndex + 1}</h3>
</div>
<form>
    <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"
        .value=${data.text}></textarea>

    ${createAnswerListForOneQuestion(data, questionIndex)}
</form>`;

const viewTemplate = (data, questionIndex, onEdit, onDelete) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
        <button @click=${()=> onDelete(questionIndex)} class="input submit action"><i class="fas fa-trash-alt"></i>
            Delete</button>
    </div>
    <h3>Question ${questionIndex + 1}</h3>
</div>
<div>
    <p class="editor-input">${data.text}</p>
    ${data.answers.map((a, answerIndex) => radioView(a, data.correctIndex == answerIndex))}
</div>`;

const radioView = (value, checked) => html`
<div class="editor-input">
    <label class="radio">
        <input class="input" type="radio" disabled ?checked=${checked} />
        <i class="fas fa-check-circle"></i>
    </label>
    <span>${value}</span>
</div>`;
// {/* <div class="loading-overlay working"></div> */}

export function createQuestion(quizId, question, removeQuestion, updateCount, edit) {
    let currentQuestion = copyQuestion(question);
    let questionIndex = 0;
    let editorActive = edit || false;
    const element = document.createElement('article');
    element.className = 'editor-question';

    showView();

    return update;

    function update(newQuestionIndex) {
        questionIndex = newQuestionIndex;
        if (editorActive) {
            showEditor();
        } else {
            showView();
        }

        return element;
    }

    function onEdit() {
        editorActive = true;
        showEditor();
    }

    /*
    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this question?');
        if (confirmed) {
            element.remove();
        }
    }*/

    async function onSave() {
        const formData = new FormData(element.querySelector('form'));

        // const simplydata = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});
        const simplydata = [...formData.entries()];

        const answers = simplydata
            .filter(([k, v]) => k.includes('answer-'))
            .reduce((a, [k, v]) => {
                const index = Number(k.split('-')[1]);
                a[index] = v;
                return a;
            }, []);

        const bodyQuestion = {
            text: formData.get('text'),
            answers,
            correctIndex: Number(simplydata.find(([k, v]) => k.includes('question-'))[1]) //we take only this element of the data which contains 'question-'
        }

        const loader = createOverlay();
        try {
            element.appendChild(loader);

            if (question.objectId) {
                //update - with Update we have the data from the Back4Up
                await updateQuestion(question.objectId, bodyQuestion);
                Object.assign(question, bodyQuestion);
                currentQuestion = copyQuestion(question);
                editorActive = false;
                update(questionIndex);
            } else {
                //create - with Create we do not have initially the data from the Back4Up, but the server response we take it
                const result = await apiCreateQuestion(quizId, bodyQuestion);
                question.objectId = result.objectId;
                updateCount();
            }
            
            Object.assign(question, bodyQuestion);
            currentQuestion = copyQuestion(question);
            editorActive = false;
            update(questionIndex);

        } catch (err) {
            console.error(err);
        } finally {
            loader.remove();
        }
    }

    function onCancel() {
        editorActive = false;
        currentQuestion = copyQuestion(question);
        showView();
    }

    function showView() {        
        //decorating function removeQuestion
        const onDelete = async (index) => {
            debugger;
            const loader = createOverlay();
            element.appendChild(loader);
            await removeQuestion(index, question.objectId);
            element.removeChild(loader);
        };

        //removeQuestion function taken from the higher level (the listQuestions.js file) 
        render(viewTemplate(currentQuestion, questionIndex, onEdit, onDelete), element);
    }

    function showEditor() {
        render(editorTemplate(currentQuestion, questionIndex, onSave, onCancel), element);
    }
}

function copyQuestion(question) {
    const currQ = Object.assign({}, question);
    currQ.answers = currQ.answers.slice();

    return currQ;
}