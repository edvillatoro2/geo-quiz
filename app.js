let currentScore = 0;
let currentQuestionIndex = 0;
let questions = []; 

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
                console.log("question", question);

                const options = [...questionData.incorrect_answers, questionData.correct_answer];
                console.log("options", options);

                const correctAnswer = questionData.correct_answer;

                questions.push({
                    question: question,
                    options: options,
                    correctAnswer: correctAnswer
                });
            });

            displayQuestion();
        })
        .catch(err => console.error('Error fetching question:', err));
}

        function displayQuestion() {
            if (currentQuestionIndex < questions.length) {
                const currentQuestion = questions[currentQuestionIndex];
                // Display the question text
                document.getElementById('question-text').textContent = currentQuestion.question.replace(/[^a-z\d\s\-]+/igm, '');

                const optionsContainer = document.getElementById('options-container');
                optionsContainer.innerHTML = ''; // Clear previous options

                // Create and append each option
                currentQuestion.options.forEach((option, index) => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('option');
                    optionElement.textContent = option;
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
            fetchQuestion();
        }

        // Start the quiz when the page loads
        fetchQuestion();