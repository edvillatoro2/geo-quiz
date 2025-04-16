let currentScore = 0;
let currentQuestionIndex = 0;
let questions = [];
let askedQuestions = [];

function fetchQuestion() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => {
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
        .then(data => {
            console.log('Data fetched:', data);
            const questionsData = data.results;

             // Loop through the results to extract individual questions and options
             questionsData.forEach(questionData => {
                const question = questionData.question;
                
                 // Check if the question has already been asked
                 if (!askedQuestions.includes(question)) {
                    console.log("New question:", question);

                    const options = [...questionData.incorrect_answers, questionData.correct_answer];
                    console.log("options", options);

                    const correctAnswer = questionData.correct_answer;

                    questions.push({
                        question: question,
                        options: options,
                        correctAnswer: correctAnswer
                    });

                    askedQuestions.push(question);
                 } else {
                    console.log("Question already asked:", question);
                 }
            });
            // If we've got enough questions, start the quiz
            if (questions.length >= 10) {
                displayQuestion();
            } else {
                 // If not enough new questions, try fetching again
                fetchQuestion()
            }
        })
        .catch(err => console.error('Error fetching question:', err));
}

function decodeHtmlEntities(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
}

        function displayQuestion() {
            if (currentQuestionIndex < questions.length) {
                const currentQuestion = questions[currentQuestionIndex];
                // Display the question text
                document.getElementById('question-text').textContent = decodeHtmlEntities(currentQuestion.question);

                const optionsContainer = document.getElementById('options-container');
                // Clear previous options
                optionsContainer.innerHTML = '';

                // Create and append each option
                currentQuestion.options.forEach((option, index) => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('option');
                    optionElement.textContent = decodeHtmlEntities(option);
                    optionElement.onclick = () => checkAnswer(option, currentQuestion.correctAnswer);
                    optionsContainer.appendChild(optionElement);
                });
            } else {
                showQuizOver();
            }
        }

        // Function to check the selected answer
        function checkAnswer(selectedOption, correctAnswer) {
            if (selectedOption === correctAnswer) {
                currentScore++;
            }
            currentQuestionIndex++;

            // update score display
            document.getElementById('score').textContent = `Score: ${currentScore}`;

             // If there are more questions, display the next question, otherwise end the quiz
            if (currentQuestionIndex < questions.length) {
                displayQuestion();
            } else {
                showQuizOver();
            }
        }

        function showQuizOver() {
            document.getElementById('quiz').style.display = 'none';
            document.getElementById('quiz-over').style.display = 'block';
            document.getElementById('final-score').textContent = `Your final score: ${currentScore}`;
        }

        function startNewQuiz() {
            currentScore = 0;
            currentQuestionIndex = 0;
            document.getElementById('quiz').style.display = 'block';
            document.getElementById('quiz-over').style.display = 'none';
            questions = [];
            askedQuestions = [];
            fetchQuestion();
        }

        // Start the quiz when the page loads
        fetchQuestion();