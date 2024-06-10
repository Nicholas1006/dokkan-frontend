// Function to fetch JSON data based on sub-URL
export function getJson(subURL) {
    return fetch('dbManagement/jsons/' + subURL + '.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok' + response.statusText);
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error fetching JSON:', error);
          throw error; // Re-throw the error to propagate it to the caller
      });
  }

