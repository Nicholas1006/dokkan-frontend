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

export function typingToColor(typing){
    if(typing.toLowerCase()=="agl"){
        return("#0000FF")
    }
    if(typing.toLowerCase()=="str"){
        return("#FF0000")
    }
    if(typing.toLowerCase()=="teq"){
        return("#00FF00")
    }
    if(typing.toLowerCase()=="phy"){
        return("#FFFF00")
    }
    if(typing.toLowerCase()=="int"){
        return("#FF00FF")
    }
}

export function LightenColor(color, percent){
    var num = parseInt(color.slice(1),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

export function colorToBackground(color){
    if(color=="#0000FF"){
        return("#28147C")
    }
    if(color=="#FF0000"){
        return("#711100")
    }
    if(color=="#00FF00"){
        return("#004f17")
    }
    if(color=="#FFFF00"){
        return("#b07404")
    }
    if(color=="#FF00FF"){
        return("#680474")
    }
}

export function getBaseDomain() {
    let host = window.location.host; // e.g., 'www.example.com', 'staging.example.com'
    let parts = host.split('.');
    if (parts.length > 2) {
        // Remove the subdomain part (e.g., 'www', 'staging')
        parts.shift();
    }
    return parts.join('.');
}