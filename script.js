// Function to hide answer
function hideAnswer() {
  $('.card-answer').fadeOut();
}

// Function to display flashcard
function displayFlashcard(flashcard) {
  const flashcardContainer = $('#flashcardContainer');
  flashcardContainer.empty();

  const cardBody = $('<div class="card-body">');
  const cardQuestion = $(`<h5 class="card-title">${flashcard.question}</h5>`);
  const cardAnswer = $(`<p class="card-text card-answer" style="display: none;">${flashcard.answer}</p>`);
  const nextButton = $('<button class="btn btn-success mr-2" onclick="loadNextFlashcard()">Next</button>');
  const hideButton = $('<button class="btn btn-danger mr-2" onclick="hideAnswer()">Hide Answer</button>');
  const flipButton = $('<button class="btn btn-primary mr-2" onclick="showAnswer()">Show Answer</button>');

  cardBody.append(cardQuestion, cardAnswer, flipButton, hideButton,  nextButton,);
  flashcardContainer.append(cardBody);
}

// Function to display the answer
function showAnswer() {
  const cardAnswer = $('.card-answer');
  cardAnswer.fadeIn();
}

// Function to load and display a new random flashcard
  function loadNextFlashcard() {
    fetch('http://localhost:3000/api/flashcards')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const flashcard = data[randomIndex];
          displayFlashcard(flashcard);
          hideAnswer();
        } else {
          console.log('No flashcards available.');
        }
      })
      .catch(error => console.error('Error loading flashcard:', error));
  }
  
  function loadHistory() {
    fetch('http://localhost:3000/api/history')
      .then(response => response.json())
      .then(history => {
        const historyList = $('#historyList');
        historyList.empty();
  
        history.forEach(entry => {
          const listItem = $('<li class="list-group-item history-item">');
          const question = $(`<div class="history-question font-weight-bold">${entry.question}</div>`);
          const answer = $(`<div class="history-answer d-none">${entry.answer}</div>`);
  
          listItem.append(question, answer);
          historyList.append(listItem);
  
          listItem.on('click', function () {
            // Toggle the display of the answer when the item is clicked
            answer.toggleClass('d-none');
          });
        });
      })
      .catch(error => console.error('Error loading history:', error));
  }  

  // Function to handle history item click
  $(document).on('click', '.history-item a', function (e) {
    e.preventDefault();
    const answer = $(this).data('answer');
    displayAnswerFromHistory(answer);
  });
  
  // Function to display the answer from history
  function displayAnswerFromHistory(answer) {
    const flashcardContainer = $('#flashcardContainer');
    flashcardContainer.empty();
  
    const cardBody = $('<div class="card-body">');
    const cardAnswer = $(`<p class="card-text card-answer">${answer}</p>`);
  
    cardBody.append(cardAnswer);
    flashcardContainer.append(cardBody);
  }
  
  
// Function to handle form submission
$('#addQuestionForm').submit(function (e) {
  e.preventDefault();

  const question = $('#questionInput').val();
  const answer = $('#answerInput').val();

  // Wait for the DOM to be ready
$(document).ready(function () {
  const addQuestionForm = document.getElementById('addQuestionForm');
  const successMessage = document.getElementById('successMessage');

  addQuestionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');

    const newFlashcard = {
      question: questionInput.value,
      answer: answerInput.value,
    };

    // Send the data to your server using Fetch or AJAX
    fetch('http://localhost:3000/api/flashcard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFlashcard),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Flashcard added:', data);
        successMessage.textContent = 'Flashcard successfully added!';
        successMessage.style.display = 'block';
        // Optionally, update the UI or provide feedback to the user
      })
      .catch(error => {
        console.error('Error adding flashcard:', error);
        successMessage.textContent = 'Error adding flashcard';
        successMessage.style.display = 'block';
      });

    // Clear the form inputs
    questionInput.value = '';
    answerInput.value = '';
  });
})
});


// Load the initial flashcard
loadNextFlashcard();
loadHistory();


