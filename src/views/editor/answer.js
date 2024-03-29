import { html, render } from '../../lib.js';

const radioEdit = (questionIndex, answerIndex, value, checked) => html`
<div class="editor-input">
    <label class="radio">
        <input class="input" type="radio" name=${`question-${questionIndex}`} value=${answerIndex}
            ?checked=${checked} />
        <i class="fas fa-check-circle"></i>
    </label>
    <input class="input" type="text" name=${`answer-${answerIndex}`} .value=${value} />
    <button data-index=${answerIndex} class="input submit action"><i class="fas fa-trash-alt"></i></button>
</div>`;


export function createAnswerListForOneQuestion(data, questionIndex) {
    const answers = data.answers;
    const element = document.createElement('div');
    element.addEventListener('click', onDelete);
    element.addEventListener('change', onChange);

    update();

    return element;

    function update() {
        render(html`
        ${answers.map((a, answerIndex) => radioEdit(questionIndex, answerIndex, a, data.correctIndex == answerIndex))}
        <div class="editor-input">
            <button @click=${addAnswer} class="input submit action">
                <i class="fas fa-plus-circle"></i>
                Add answer
            </button>
        </div>`, element)
    }

    function onChange(e) {
        if (e.target.getAttribute('type') == 'text') {
            const indexUpdatedEditedAnswer = Number(e.target.name.split('-')[1]);
        answers[indexUpdatedEditedAnswer] = e.target.value || '';
        } else {
            data.correctIndex = Number(e.target.value);
        }
       
        // console.log(indexUpdatedEditedAnswer);
    }

    function addAnswer(e) {
        e.preventDefault();
        answers.push(''); // adds one more element (an empty symbol) to the end of the array = 1 radioEdit more
        update();
    }

    function onDelete(e) {
        let target = e.target;
        //In case we click in the inner element <i class="fas fa-trash-alt"></i>
        while (target && target != element && target.tagName != 'BUTTON') {
            target = target.parentNode;
        }
        const radioEditToDeleteWithIndex = target.dataset.index;
        if (radioEditToDeleteWithIndex != undefined) {
            e.preventDefault();
            answers.splice(radioEditToDeleteWithIndex, 1);
            update();
        }
    }
}