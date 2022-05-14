//debuggin http requests
// import * as api from './api/data.js';
// window.api = api;

import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js';
import {browsePage} from './views/browse.js';
import {loginPage, registerPage} from './views/authorization.js';
import { getUserData } from './util.js';
import { logout } from './api/data.js';
import { quizPage } from './views/quiz/quiz.js';

// window.submitSolution = submitSolution;

const root = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext)
page('/create', editorPage);
page('/edit/:id', editorPage);
page('/browse', browsePage);
page('/login', loginPage);
page('/register', registerPage);
page('/quiz/:id', quizPage)

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.renderProp = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

function updateUserNav() {
    const userData = getUserData();
   
    if (userData) {
        document.getElementById('welcomeMsg').textContent = `Welcome, ${userData["username"]}`;
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';
        
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }    
}

async function onLogout() {
    await logout();
    updateUserNav();// в същия scope
    page.redirect('/');
}
