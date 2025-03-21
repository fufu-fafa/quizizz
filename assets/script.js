document.getElementById("quiz-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const pin = document.getElementById("pin").value;
    
    fetch(`https://cloudflare.osintstuf.workers.dev/?pin=${pin}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";

            if (!data.data || !data.data.answers) {
                resultsDiv.innerHTML = "<p style='color:red;'>Invalid PIN or No Answers Found</p>";
                return;
            }

            data.data.answers.forEach(item => {
                const questionText = new DOMParser().parseFromString(item.question.text, "text/html").body.textContent;
                const answers = item.answers.map(ans => new DOMParser().parseFromString(ans.text, "text/html").body.textContent);

                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                questionDiv.textContent = questionText;

                const answersList = document.createElement("ul");
                answersList.classList.add("answers");
                answers.forEach(answer => {
                    const li = document.createElement("li");
                    li.textContent = answer;
                    answersList.appendChild(li);
                });

                resultsDiv.appendChild(questionDiv);
                resultsDiv.appendChild(answersList);
            });
        })
        .catch(error => {
            document.getElementById("results").innerHTML = "<p style='color:red;'>Error fetching data</p>";
        });
});