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
    //image.src = "dbManagement/assets/final_assets/1023620.png"

    const textContainer = document.getElementById('text-container');
    const text = document.createElement('p');
    text.textContent = "This is a text";
    textContainer.appendChild(text);
    //return subURL;
    textContainer.innerHTML = subURL;
  }

  // Get sub-URL from the global variable set by the server
  subURL = window.suburl;
  fetchData(subURL);
});
