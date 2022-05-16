import { html, render, topics } from '../../lib.js';
import { createList } from './listQuestions.js';
import { createQuiz, getQuizById, updateQuiz, getQuestionsByQuizId } from '../../api/data.js';
import { getUserData } from '../../util.js';


const template = (quiz, quizEditor, updateCount) => html`
<section id="editor">
    <header class="pad-large">
        <h1>${quiz ? 'Edit Quiz' : 'New quiz'}</h1>
    </header>

    ${quizEditor}
    <div class="pad-large alt-page">

    </div>

    ${quiz ? createList(quiz.objectId, quiz.questions, updateCount) : ''}
</section>`;

const quizEditorTemplate = (quiz, onSave, working) => html`
<form @submit=${onSave}>
    <label class="editor-label layout">
        <span class="label-col">Title:</span>
        <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : ''} ?disabled=${working}>
    </label>
    <label class="editor-label layout">
        <span class="label-col">Topic:</span>
        <select class="input i-med" name="topic" .value=${quiz ? quiz.topic : '0'} ?disabled=${working}>
            <option value="0">-- Select category</option>
            ${ !quiz ?
                Object.entries(topics).map(([k, v]) => html`<option value=${k}>${v}</option>`)
                :
                Object.entries(topics).map(([k, v]) => html`<option value=${k} ?selected=${quiz.topic==k}>${v}</option>`)
            }
            <!-- -->
        </select >
    </label >
    <label class="editor-label layout">
        <span class="label-col">Description:</span>
        <textarea class="input" name="description" .value=${quiz ? quiz.description : ''}
        ?disabled=${working}></textarea>
    </label >
    <input class="input submit action" type="submit" value=${quiz ? 'Save' : 'Create'}>
    </form>
${ working ? html`<div class="loading-overlay working"></div>` : '' } `;

// <!-- ?selected=${quiz.topic == k} -->


/*
const questions = [
    {
        text: 'Is this the first question?',
        answers: [
            'Yes',
            'No',
            'Maybe'
        ],
        correctIndex: 0
    },
    {
        text: 'Is this the second question?',
        answers: [
            'Maybe',
            'No',
            'Yes'
        ],
        correctIndex: 1
    }
];*/

function createQuizEditor(quiz, onSave) {
    const element = document.createElement('div');
    element.className = 'pad-large alt-page';
    update();

    return {
        editor: element,
        updatedEditor: update
    }

    function update(working) {
        render(quizEditorTemplate(quiz, onSave, working), element);
    }
}


export async function editorPage(ctx) {
    if (!getUserData()) {
        return alert('Please, log in with a user to create or edit a Quiz');
    }
    const quizId = ctx.params.id;
    let quiz = null;
    let questions = [];
    if (quizId) {
        [quiz, questions] = await Promise.all([
            await getQuizById(quizId),
            await getQuestionsByQuizId(quizId, getUserData().userId)
        ]);
        quiz.questions = questions;
    }

    const { editor, updatedEditor } = createQuizEditor(quiz, onSave);

    ctx.renderProp(template(quiz, editor, updateCount));

    async function updateCount(change = 0) {
        const count = questions.length + change;
        await updateQuiz(quizId, { questionCount: count });
    }

    async function onSave(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const title = formData.get('title');
        const topic = formData.get('topic');
        const description = formData.get('description');

        const dataQuiz = {
            title, topic, description,
            questionCount: questions.length
        };

        try {
            updatedEditor(true);

            if (quizId) {
                await updateQuiz(quizId, dataQuiz);
                ctx.page.redirect('/browse');
            } else {
                const result = await createQuiz(dataQuiz);
                ctx.page.redirect('/edit/' + result.objectId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            updatedEditor(false);
        }
    }
}

