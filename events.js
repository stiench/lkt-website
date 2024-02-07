let events = [];
let members = [];

async function loadEvents() {
  await fetch('./data/events.json')
  .then((response) => response.json())
  .then((json) => events = json);
}
async function loadMembers() {
  await fetch('./data/members.json')
  .then((response) => response.json())
  .then((json) => members = json);
}

function generateEvents() {
  var tbodyRef = document.getElementById('tableEvents').getElementsByTagName('tbody')[0];
  var theadRef = document.getElementById('tableEvents').getElementsByTagName('thead')[0].rows[0];

  members = members.filter(member => member.end == "");
  members.sort(function (first, second) {
    return second.name - first.name;
  });
  members.forEach(function (member) {
    theadRef.insertCell().outerHTML = "<th width=\"70\">" + member.name + "</th>";
  });

  events.sort(function (first, second) {
    let date1 = new Date(first.start.replace(/-/g,'/')).getTime();
    let date2 = new Date(second.start.replace(/-/g,'/')).getTime();
    return date2 - date1;
  });

  events.forEach(function (event) {
    var newRow = tbodyRef.insertRow();
    var style = "";

    if (!event.isCDO)
      style = "background-color: #CBF2FF;";

    newRow.insertCell().outerHTML = "<th style='" + style + "'>" + event.year + "</th>";
    newRow.insertCell().outerHTML = "<th style='" + style + "'>" + event.where + "</th>";
    newRow.insertCell().outerHTML = "<th style='" + style + "'>" + event.start + "</th>";
    newRow.insertCell().outerHTML = "<th style='" + style + "'>" + event.end + "</th>";

    members.forEach(function (member) {
      if (event.members.includes(member.name)) {
        newRow.insertCell().outerHTML = "<th style='" + style + "'><i class='fa fa-check fa-lg' aria-hidden='true' style='color:#008000;'></i></th>";
      }else{
        newRow.insertCell().outerHTML = "<th style='" + style + "'></th>";
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadEvents()
  .then(() => loadMembers())
  .then(() => {
    generateEvents();
  })

  console.log("\r\n .----------------.  .----------------.   .----------------.  .----------------.  .----------------. \r\n| .--------------. || .--------------. | | .--------------. || .--------------. || .--------------. |\r\n| |  _________   | || |    ______    | | | | ____    ____ | || |     _____    | || |     ______   | |\r\n| | |  _   _  |  | || |  .\' ___  |   | | | ||_   \\  \/   _|| || |    |_   _|   | || |   .\' ___  |  | |\r\n| | |_\/ | | \\_|  | || | \/ .\'   \\_|   | | | |  |   \\\/   |  | || |      | |     | || |  \/ .\'   \\_|  | |\r\n| |     | |      | || | | |    ____  | | | |  | |\\  \/| |  | || |      | |     | || |  | |         | |\r\n| |    _| |_     | || | \\ `.___]  _| | | | | _| |_\\\/_| |_ | || |     _| |_    | || |  \\ `.___.\'\\  | |\r\n| |   |_____|    | || |  `._____.\'   | | | ||_____||_____|| || |    |_____|   | || |   `._____.\'  | |\r\n| |              | || |              | | | |              | || |              | || |              | |\r\n| \'--------------\' || \'--------------\' | | \'--------------\' || \'--------------\' || \'--------------\' |\r\n \'----------------\'  \'----------------\'   \'----------------\'  \'----------------\'  \'----------------\' ");
});
