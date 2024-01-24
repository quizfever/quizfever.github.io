#Quiz system - Quiz fever - a web application
**https://quizfever.github.io/**
A system for creating, managing and filling tests - a registration is required.

A Simple user anybody can log in with - pending

## Functionality
* Registering of users
* Possibility to view and solve other user's quizzes
* Different topics for the quizzes
* Possibility for searching quizzes by title (caseInsensitive - the search is on the backend server Back4Up)
* Interactive editor for the quizzes
* Interactive flexible UI

## Technology
* HTML, CSS, JavaScript
* lit-html, page
* Client-side at: GitHub Pages
* Backend server-side at: Back4Up

## Screens (Pages)
* **Welcome Screen** (landing page)
* **Login/Register** - registration with e-mail, username and password
* **Quiz BrowseAll** - list with all quizzes
* **Quiz Details** - additional description, test statistics, author information and starting solving the quiz
* **Quiz Contest Mode** - answering questions, each question has a separate view, possibility to freely navigate through the questions - from one question to another, possibility to restart solving the quiz
* **Profile Page** - information for the most recently created quiz and general info about number of quizzes in number of topics - for guests and logged-in users
* **Quiz editor** - integrated editor for quizzes, questions and answers
* **Quiz MyQuizes** - a list with my quizzes - only for logged-in users
* **Quiz Search** - possibility to search quiz by title
* **Quiz Results** - summary of results, possibility to review the mistaken/all questions - IMPORTANT - the link button 'Close the quiz results' should be clicked after finishing solving the quiz so that we clear the cache[quizId]

## Plan for implementation
### Part 1
* Creating and adjusting the backend app Back4Up
* Deploying the web application in GitHub Pages
* Login/Register page
* Quiz editor functionality

### Part 2
* Finishing structure and stylization
* Welcome Screen
* Quiz browser
* Quiz details
* Quiz Contest Mode
* Quiz Results
* Profile Page

### Part 3
* Quiz MyQuizzes
* Quiz Search

## Implementation
### Structure of the data
#### Collections
* Session (by Back4Up - we do not touch the sessions in reality, but we can delete unclosed session from Back4Up)
* Users
``` javascript
{
    email: String,
    username: String,
    password: String
}
```

* Quizzes
``` javascript
{
    title: String,
    topic: String,
    questionCount: Number
}
```

* Questions - in each question there will be an array of answers
``` javascript
{
    text: String,
    answers: Array<String>,
    correctIndex: Number,
    quiz: Pointer<Quiz> //Back4Up gives us this possibility 
}
```

* Solutions
``` javascript
{
    quiz: Pointer<Quiz>,
    correctAnswers: Number
}
```

### Access control
* The guests can register/login, can review the quiz catalog, can view the test details and the profile page
* The registered/logged-in users can:
    - solve different quizzes,
    - review the quiz result and the details (including mistaken questions)
    - create new quizzes and edit them 
* Only the author who created the quiz, he/she can edit his/her quiz
* Each registered and logged-in user can solve any quiz (own quizzes and quizzes of another users) and the result is saved in the Back4Up database


### Single Page Apps for GitHub Pages
* Added 404.html and initial script in the index.html file - in order our single page application (SPA) not to crash when re-loading a page


### More quiz fever ideas:
- Begin quiz without results to be saved in the db - each guest (not registered/not logged-in user) to be possible to solve any quiz and be possible to see the test result and the details (mistaken questions), and/but the result not to be saved in the database - pending
- Option the owner of a quiz to delete it - deleting quiz by the quiz author - pending - not needed at this time
- Possibility to filter quizzes by topic - pending
- Maintaining statistics for each registered user and quiz - pending
  - public - solutions of a quiz - keeping the best result of quizzes taken by which user
  - private - result points of quizzes a user have taken - per quiz

