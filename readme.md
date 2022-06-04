#Quiz system - Quiz fever - a web application
https://quizfever.github.io/
A system for creating, managing and filling tests - a registration is required.

## Functionality
* Registering of users
* Possibility to view and solve other user's quizes
* Different topics for the quizes
* Possibility for searching quizes by title (caseInsensitive - the search in on the backend server Back4Up)
* Interactive editor for the quizes
* Interactive flexible UI

## Technology
* HTML, CSS, JavaScript
* lit-html, page
* Client-side at: GitHub Pages
* Backend server-side at: Back4Up

## Screens (Pages)
* **Welcome Screen** (landing page)
* **Login/Register** - registration with e-mail, username and password
* **Quiz BrowseAll** - list wwith all quizes
* **Quiz Details** - additional description, test statistics, authour information and starting solving the quiz
* **Quiz Contest Mode** - answering questions, each question has a separate view, possibility to freely navigate through the questions - from one question to another, possibility to restart solving the quiz
* **Profile Page** - information for the most recently created quiz - for guests and logged in users
* **Quiz editor** - integrated editor for quizes, questions and answers
* **Quiz MyQuizes** - a list with my quizes - only for logged in users
* **Quiz Search** - possibility to search quiz by title
* **Quiz Results** - summary of results, possibility to review the mistaken/all questions - IMPORTANT - the link button 'Close the quiz results' should be clicked after finishing solving the quiz so that we clear the cache[quizId]

## Plan for implementation
### Part 1
* Creating and adjusting the backhend app Back4Up
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
* Quiz MyQuizes
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

* Quizes
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
* The registered/logged in users can:
    - solve different quizes,
    - review the quiz result and the details (icluding mistaken questions)
    - create new quizes and edit them 
* Only author created can edit his/her quiz
* Each registered and logged in user can solve any quiz (own and quizes of another users) and the result is saved in the Back4Up database


### More quizfever ideas:
* begin quiz without results to be saved in the db - each guest (not registered/not loggend in user) to be possible to solve any quiz and be possible to see the test result and the details (mistaken questons), and/but the result not to be saved in the database - pending
* option to delete a quiz of an owner - by the owner - deleting quiz by the quiz auhtor - pending - not needed at this time
* Possibility to filter quizes by topic - pending
* **Profile Page** - information for all solved quizes - pending
* Maintaining statistics for each registered user and quiz - pending
*       public - solutions of a quiz - keeping the best result of quizes taken by which user
*       private - result points of quizes a user have taken - per quiz;

