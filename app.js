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
  correctAnswers = 0;
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
    // this.cardTitle.textContent = this.quiz.title;
    // this.cardText.textContent = this.quiz.questions[0].question;
    this.currentQuestion.textContent = 0;
    this.questionTotal.textContent = this.quiz.questions.length;
    // this.progressBar.style.width = "0%";
    // this.nextButton.disabled = true;
    // this.listGroupItems.forEach((listGroupItem, index) => {
    //   listGroupItem.textContent = this.quiz.questions[index].options[0];
    // });
    this.loadQuestion();
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
    this.nextQuestion();
  }

  checkAnswer() {
    this.nextButton.disabled = true;
    this.listGroupItems.forEach((listGroupItem, index) => {
      if (listGroupItem.classList.contains("active")) {
        if (this.quiz.questions[this.currentQuestion.textContent - 1].correctAnswer === index) {
          listGroupItem.classList.add("correct");
          listGroupItem.classList.remove("active");
          this.correctAnswers++;
        } else {
          const correctAnswer = this.quiz.questions[this.currentQuestion.textContent - 1].correctAnswer;
          this.listGroupItems[correctAnswer].classList.add("correct");
          listGroupItem.classList.remove("active");
          listGroupItem.classList.add("wrong");
        }
      }
    });
  }

  resetSelection() {
    this.listGroupItems.forEach((listGroupItem) => {
      listGroupItem.classList.remove("correct", "wrong");
    });
  }

  nextQuestion() {
    setTimeout(() => {
      this.resetSelection();
      this.loadQuestion();
    }, 750);
  }

  loadQuestion() {
    if (this.currentQuestion.textContent < this.quiz.questions.length) {
      this.currentQuestion.textContent++;
      this.cardText.textContent = this.quiz.questions[this.currentQuestion.textContent - 1].question;
      this.listGroupItems.forEach((listGroupItem, index) => {
        listGroupItem.textContent = this.quiz.questions[this.currentQuestion.textContent - 1].options[index];
      });
      this.progressBar.style.width = `${(this.currentQuestion.textContent / this.quiz.questions.length) * 100}%`;
      this.progressBar.textContent = `${(this.currentQuestion.textContent / this.quiz.questions.length) * 100}%`;
    } else {
      this.cardText.textContent = "Quiz beendet!";
      console.log(this.correctAnswers);
    }
  }
  reset() {
    this.currentQuestion.textContent = 1;
    this.cardText.textContent = this.quiz.questions[0].question;
    this.progressBar.style.width = "0%";
    this.nextButton.disabled = true;
    this.loadQuestion();

    this.listGroupItems.forEach((listGroupItem) => {
      listGroupItem.classList.remove("correct", "wrong");
    });

    this.correctAnswers = 0;
  }
}
