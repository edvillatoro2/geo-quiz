function fetchQuestion() {
    fetch('https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiple') // Replace with actual API endpoint
        .then(response => response.json())
        .then(data => {
            const question = data.question;
            console.log("question", question)
            const options = data.options; // options: an array of answers
            const correctAnswer = data.correctAnswer;

            questions.push({
                question: question,
                options: options,
                correctAnswer: correctAnswer
            });

            displayQuestion();
        })
        .catch(err => console.error('Error fetching question:', err));
}