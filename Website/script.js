document.addEventListener('DOMContentLoaded', function() {
  // Function to fetch JSON data and image based on sub-URL
  function fetchData(subURL) {
    fetch('dbManagement/jsonsCompressed/' + subURL + '.json')
      .then(response => response.json())
      .then(data => {
        // Call function to generate questions based on JSON data
        generateQuestions(data.questions);
      })
      .catch(error => console.error('Error fetching JSON:', error));
    
    const imageContainer = document.getElementById('image-container');
    const image = new Image();
    image.onload = function() {
      imageContainer.appendChild(image);
    };
    image.onerror = function() {
      console.error('Error loading image:', image.src);
      // Display placeholder image or error message
    };
    image.src = 'dbManagement/assets/final_assets/' + subURL + '.png';
    //image.src = "dbManagement/assets/final_assets/1020760.png"

    const textContainer = document.getElementById('text-container');
    const text = document.createElement('p');
    text.textContent = "This is a text";
    textContainer.appendChild(text);
    //return subURL;
    textContainer.innerHTML = subURL;
  }

  // Function to generate questions dynamically based on JSON data
  function generateQuestions(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; // Clear previous questions

    questions.forEach(question => {
      const questionElement = document.createElement('div');
      questionElement.textContent = question.question;

      if (question.type === 'slider') {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = question.min;
        slider.max = question.max;
        slider.value = question.min; // Set initial value
        // Attach event listener to slider to capture user input
        slider.addEventListener('input', () => {
          // Update result based on user input
          updateResult();
        });
        questionElement.appendChild(slider);
      } else if (question.type === 'multiple_choice') {
        // Create multiple choice options dynamically
        // Add event listeners to capture user input
      }

      container.appendChild(questionElement);
    });
  }

  // Function to calculate result based on user input and formula
  function updateResult() {
    // Calculate result based on user input and formula
    const result = calculateResult();
    // Update UI with result
    document.getElementById('result').textContent = result;
  }

  // Function to calculate result based on user input and formula
  function calculateResult() {
    // Implement your formula here
    // Return the calculated result
    return 'Calculated Result';
  }

  // Example: Fetch data based on sub-URL
  //const subURL = 'example';
  //const urlParams = new URLSearchParams(window.location.search);
  //const subURL = urlParams.get('subURL'); // Assuming subURL is passed as a query parameter
  
  fetchData(subURL);
});
