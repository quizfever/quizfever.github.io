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


export function createAnswerListForOneQuestion(answers, questionIndex, correctIndex) {
    const currentAnswersData = answers.slice();
    const element = document.createElement('div');
    element.addEventListener('click', onDelete);

    update();

    return element;

    function update() {
        render(html`
        ${currentAnswersData.map((a, answerIndex) => radioEdit(questionIndex, answerIndex, a, correctIndex == answerIndex))}
        <div class="editor-input">
            <button @click=${addAnswer} class="input submit action">
                <i class="fas fa-plus-circle"></i>
                Add answer
            </button>
        </div>`, element)
    }

    function addAnswer(e) {
        e.preventDefault();
        currentAnswersData.push('');//добавя един елемент празен символ повече към масива = един radioEdit повече
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
            currentAnswersData.splice(radioEditToDeleteWithIndex, 1);
            update();
        }
    }
}