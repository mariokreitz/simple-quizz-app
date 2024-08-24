document.addEventListener("DOMContentLoaded", async () => {
  const { cardTitle, cardText, listGroupItems, nextButton, currentQuestion, questionTotal, progressBar } =
    getAllElements();

  const QUIZ = await fetchData("./data/quiz.json");

  const quiz = new Quiz(
    QUIZ,
    cardTitle,
    cardText,
    listGroupItems,
    nextButton,
    currentQuestion,
    questionTotal,
    progressBar
  );
  quiz.Initialize();
  quiz.start();
});

function getAllElements() {
  const cardTitle = document.querySelector(".card-title");
  const cardText = document.querySelector(".card-text");
  const listGroupItems = document.querySelectorAll(".list-group-item");
  const currentQuestion = document.querySelector("#currentQuestion");
  const questionTotal = document.querySelector("#question-total");
  const progressBar = document.querySelector(".progress-bar");
  const nextButton = document.querySelector(".btn-primary");
  return { cardTitle, cardText, listGroupItems, nextButton, currentQuestion, questionTotal, progressBar };
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

class Quiz {
  constructor(quiz, cardTitle, cardText, listGroupItems, nextButton, currentQuestion, questionTotal, progressBar) {
    this.quiz = quiz;
    this.cardTitle = cardTitle;
    this.cardText = cardText;
    this.listGroupItems = listGroupItems;
    this.nextButton = nextButton;
    this.currentQuestion = currentQuestion;
    this.questionTotal = questionTotal;
    this.progressBar = progressBar;
  }

  Initialize() {
    this.listGroupItems.forEach((listGroupItem, index) => {
      listGroupItem.addEventListener("click", () => {
        this.select(index);
      });
    });
    this.nextButton.addEventListener("click", () => {
      this.next();
    });
  }

  start() {
    this.cardTitle.textContent = this.quiz.title;
    this.cardText.textContent = this.quiz.questions[0].question;
    this.currentQuestion.textContent = 1;
    this.questionTotal.textContent = this.quiz.questions.length;
    this.progressBar.style.width = "0%";
    this.nextButton.disabled = true;
    this.listGroupItems.forEach((listGroupItem, index) => {
      listGroupItem.textContent = this.quiz.questions[index].options[0];
    });
  }

  select(index) {
    this.listGroupItems.forEach((listGroupItem) => {
      listGroupItem.classList.remove("active");
    });
    this.listGroupItems[index].classList.add("active");
    this.nextButton.disabled = false;
  }

  next() {
    this.checkAnswer();
  }

  checkAnswer() {
    this.listGroupItems.forEach((listGroupItem, index) => {
      if (listGroupItem.classList.contains("active")) {
        if (this.quiz.questions[this.currentQuestion.textContent - 1].correctAnswer === index) {
          listGroupItem.classList.add("correct");
        } else {
          listGroupItem.classList.add("wrong");
        }
      }
    });
  }
}
