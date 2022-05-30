#Quiz system - Quiz fever
https://quizfever.github.io/
Система за създаване, управление и попълване на тестове - необходима е регистрация.

## Функционалност
* Регистрация на потребители
* Възможност за разглеждане и решаване на тестове от други потребители
* Различни теми/категории, свързани с тестовете
* Възможност за търсене по заглавие (caseInsensitive - на backend server-а Back4Up)
* Интерактивен редактор за тестове
* Интерактивен, гъвкав UI

## Технологии
* HTML, CSS, JavaScript
* lit-html, page
* Client-side at: GitHub Pages
* Backend server-side at: Back4Up

## Екрани (страници)
* **Welcome Screen** (landing page)
* **Login/Register** - регистрация с мейл, потребителско име, парола
* **Quiz BrowseAll** - списък с всички тестове
* **Quiz details** - допълнително описание, статистика за теста, информация за автора и възможност за стартиране на теста
* **Quiz Contest Mode** - отговаряне на въпроси, всеки въпрос е в отделен изглед, възможност за свободно преминаване от въпрос на въпрос, възможност за рестартиране на теста
* **Profile Page** - информация за създадени тестове и всички решени тестове
* **Quiz editor** - интегриран редактор за тестове, въпроси и отговори
* **Quiz MyQuizes** - списък с моите тестове
* **Quiz Search** - възможност за търсене по заглавие на quiz
* **Quiz Results** - обобщение на резултатите, възможност за преглеждане на сгрешените въпроси - ВАЖНО - линка бутон 'Close the quiz results' трябва да се натиска, за да се занулява нашия кеш - clearing the cache[quizId]

## План за изпълнение
### Part 1
* Създаване и настройване на приложение Back4Up
* Деплойване на приложение в GitHub Pages
* Login/Register страница
* Quiz editor функционалност

### Part 2
* Довършване на структура и стилизация
* Welcome Screen
* Quiz browser
* Quiz details
* Quiz Contest Mode
* Quiz Results
* Profile Page

### Part 3
* Quiz MyQuizes
* Quiz Search

## Реализация/ Implementation
### Структура на данните
#### Колекции
* Session (служебна от Back4Up - нея не я пипаме изобщо реално)
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

* Questions - във всеки въпрос ще има масив с отговори
``` javascript
{
    text: String,
    answers: Array<String>,
    correctIndex: Number,
    quiz: Pointer<Quiz> //Back4Up ни дава тази възможност 
}
```

* Solutions
``` javascript
{
    quiz: Pointer<Quiz>,
    correctAnswers: Number
}
```

### Контрол на достъпа
* Гостите могат да се регистрират, да преглеждат каталога, детайлите на тестовете и профилната си  страница
* Регистрираните потребители могат:
    - да решават тестове,
    - да преглеждат резултатите си
    - и да създават и редактират тестове
* Само създателят на един тест може да го редактира
* Всеки регистриран потребител може да решава чужд тест и резултатът от решението на теста се записва в базата данни



### More quizfever ideas:
* begin quiz without results to be saved in the db - всеки гост(нелогнат/нерегистриран потребител) да може да решава всеки тест/quiz и да види резулатата от решението на теста,  НО без резулататът да се записва в базата данни - pending - !!!за момента работи само с логнати потребители
* option to delete a quiz of an owner - by the owner - изтриване на quiz от потребител притежател - на този етап няма да се имплементира
* Възможност за филтрация по темa - pending
* Водене на статистика за всеки потребител и тест - pending
*       public - solutions of a quiz - keeping best result of quizes taken by which user
*       private - result points of quizes a user have taken - per quiz;
