document.addEventListener('DOMContentLoaded', function() {
  // Function to fetch JSON data and image based on sub-URL
  function fetchData(subURL) {
    fetch('dbManagement/jsonsCompressed/' + subURL + '.json')
      .then(response =>{
        if(!response.ok){
          throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const typingText = data.Typing || "Typing data not found";
        const typingContainer = document.getElementById('typing-container');
        typingContainer.innerHTML = '';
        const typing = document.createElement('p');
        typing.textContent = typingText;
        typingContainer.appendChild(typing);

        const nameText = data.Name || "Name not found";
        const nameContainer = document.getElementById('name-container');
        nameContainer.innerHTML = '';
        const name = document.createElement('p');
        name.textContent = nameText;
        nameContainer.appendChild(name);
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
