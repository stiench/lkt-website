let committees = [];

async function loadCommittees() {
  await fetch('./data/committees.json')
  .then((response) => response.json())
  .then((json) => committees = json);
}

function generateC() {
  var tbodyRef = document.getElementById('tableC').getElementsByTagName('tbody')[0];

  committees.sort(function (first, second) {
    return second.year - first.year;
  });

  committees.forEach(function (committee) {
    var newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = "<th>" + committee.year + "</th>";
    newRow.insertCell().outerHTML = "<td>" + committee.p + "</td>";
    newRow.insertCell().outerHTML = "<td>" + committee.vp + "</td>";

    if (committee.c != undefined)
        newRow.insertCell().outerHTML = "<td>" + committee.c + "</td>";
    else
        newRow.insertCell().outerHTML = "<td></td>";

    if (committee.f != undefined)
        newRow.insertCell().outerHTML = "<td>" + committee.f + "</td>";
    else
        newRow.insertCell().outerHTML = "<td></td>";
  });
}

document.addEventListener('DOMContentLoaded', function() {
    loadCommittees()
    .then(() => {
      generateC();
    })
  
    console.log("\r\n .----------------.  .----------------.   .----------------.  .----------------.  .----------------. \r\n| .--------------. || .--------------. | | .--------------. || .--------------. || .--------------. |\r\n| |  _________   | || |    ______    | | | | ____    ____ | || |     _____    | || |     ______   | |\r\n| | |  _   _  |  | || |  .\' ___  |   | | | ||_   \\  \/   _|| || |    |_   _|   | || |   .\' ___  |  | |\r\n| | |_\/ | | \\_|  | || | \/ .\'   \\_|   | | | |  |   \\\/   |  | || |      | |     | || |  \/ .\'   \\_|  | |\r\n| |     | |      | || | | |    ____  | | | |  | |\\  \/| |  | || |      | |     | || |  | |         | |\r\n| |    _| |_     | || | \\ `.___]  _| | | | | _| |_\\\/_| |_ | || |     _| |_    | || |  \\ `.___.\'\\  | |\r\n| |   |_____|    | || |  `._____.\'   | | | ||_____||_____|| || |    |_____|   | || |   `._____.\'  | |\r\n| |              | || |              | | | |              | || |              | || |              | |\r\n| \'--------------\' || \'--------------\' | | \'--------------\' || \'--------------\' || \'--------------\' |\r\n \'----------------\'  \'----------------\'   \'----------------\'  \'----------------\'  \'----------------\' ");
  });
