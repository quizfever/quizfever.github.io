//debuggin http requests
// import * as api from './api/data.js';
// window.api = api;

import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import { loginPage, registerPage } from './views/authorization.js';
import { getUserData } from './util.js';
import { getQuestionsByQuizId, getQuizById, logout } from './api/data.js';
import { quizPage } from './views/quiz/quiz.js';
import {cube} from './views/common/loader.js';
import {resultPage} from './views/quiz/result.js';
import { homePage } from './views/home.js';
import { detailsPage } from './views/quiz/details.js';
import { underConstructionPage } from './views/underConstruction.js';


const cache = {};
const root = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/create', editorPage);
page('/edit/:id', editorPage);
page('/browse', browsePage);
page('/login', loginPage);
page('/register', registerPage);
page('/quiz/:id', getQuiz, quizPage);
page('/summary/:id', getQuiz, resultPage);
page('/details/:id', getQuiz, detailsPage);
page('/under-construction', underConstructionPage);

updateUserNav();
page.start();

//we raise the abstraction so that lit-html not to update the main tag every time, and so that we 
//can save the chosen radio buttons of each question. While navigating in the page, we will not lose chosen data
//We save the questions in our manually defined const  cache, we save also the selected answers in our manual cache
async function getQuiz(ctx, next) {
    ctx.clearCache = clearCache;
    const quizId = ctx.params.id;

    if (cache[quizId] == undefined) { //we have not started yet to fill in the quiz
        ctx.renderProp(cube());
        cache[quizId] = await getQuizById(quizId);
        const ownerId = cache[quizId].owner.objectId;
        cache[quizId].questions = await getQuestionsByQuizId(quizId, ownerId);
        cache[quizId].answers = cache[quizId].questions.map(q => undefined); //all questions in the beginnig are not answered
    }

    ctx.quiz = cache[quizId];//new property quiz

    next();
}

function clearCache(quizId) {
    if (cache[quizId]) {
        delete cache[quizId]; //we earse the property quizId of cache 
    }     
}

function decorateContext(ctx, next) {
    ctx.renderProp = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        const welcomeMsg = document.getElementById('welcomeMsg');
        welcomeMsg.textContent = `Welcome, ${userData["username"]}`;
        // welcomeMsg.style.fontSize = '20';
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';

    } else {
        const welcomeMsg = document.getElementById('welcomeMsg').textContent = '';
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}

async function onLogout() {
    await logout();
    updateUserNav();// в същия scope
    page.redirect('/');
}
