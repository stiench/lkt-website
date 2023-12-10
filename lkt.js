let members = [];
let tournaments = [];

async function loadMembers() {
  await fetch('./data/members.json')
  .then((response) => response.json())
  .then((json) => members = json);
}

async function loadTournaments() {
  await fetch('./data/tournaments.json')
  .then((response) => response.json())
  .then((json) => tournaments = json);
}

function generateCL() {
  var tbodyRef = document.getElementById('tableCL').getElementsByTagName('tbody')[0];

  tournaments.forEach(function (winner) {
    var newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = "<th>" + winner.year + "</th>";
    newRow.insertCell().outerHTML = "<td>" + winner.lan + "</td>";
    newRow.insertCell().outerHTML = "<td>" + winner.name + "</td>";
  });
}

function generateST() {
  var tbodyRef = document.getElementById('tableSt').getElementsByTagName('tbody')[0];

  var winsByName = {};

  members.forEach(function (member) {
    winsByName[member.name] = { name: member.name, wins: 0 };
  });

  tournaments.forEach(function (winner) {
    var splitted = winner.name.split(' & ');
    splitted.forEach(function (name) {
      if (name != 'N/A')
        if (splitted.length == 1)
          winsByName[name].wins++;
        else
          winsByName[name].wins += 0.5;
    });
  });

  var boulzWithWins = Object.keys(winsByName).map(function (key) {
    return winsByName[key];
  });

  boulzWithWins.sort(function (first, second) {
    if (second.wins == first.wins)
      return first.name.localeCompare(second.name);

    return second.wins - first.wins;
  });

  boulzWithWins.forEach(function (boulz) {
    var fullStartStr = Array(Math.floor(boulz.wins)).fill(null).reduce((a) => a + '<i class="fa fa-star fa-lg" aria-hidden="true" style="color:#facf00;"></i>', '');
    var halfStartStr = boulz.wins % 1 > 0 ? '<i class="fa fa-star-half-o fa-lg" aria-hidden="true" style="color:#facf00;"></i>' : '';

    var newRow = tbodyRef.insertRow();
    newRow.insertCell().outerHTML = "<th><center>" + fullStartStr + halfStartStr + "</center></th>";
    newRow.insertCell().outerHTML = "<td>" + boulz.name + "</td>";
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadMembers()
  .then(() => loadTournaments())
  .then(() => {
    generateCL();
    generateST();
  })

  console.log("\r\n .----------------.  .----------------.   .----------------.  .----------------.  .----------------. \r\n| .--------------. || .--------------. | | .--------------. || .--------------. || .--------------. |\r\n| |  _________   | || |    ______    | | | | ____    ____ | || |     _____    | || |     ______   | |\r\n| | |  _   _  |  | || |  .\' ___  |   | | | ||_   \\  \/   _|| || |    |_   _|   | || |   .\' ___  |  | |\r\n| | |_\/ | | \\_|  | || | \/ .\'   \\_|   | | | |  |   \\\/   |  | || |      | |     | || |  \/ .\'   \\_|  | |\r\n| |     | |      | || | | |    ____  | | | |  | |\\  \/| |  | || |      | |     | || |  | |         | |\r\n| |    _| |_     | || | \\ `.___]  _| | | | | _| |_\\\/_| |_ | || |     _| |_    | || |  \\ `.___.\'\\  | |\r\n| |   |_____|    | || |  `._____.\'   | | | ||_____||_____|| || |    |_____|   | || |   `._____.\'  | |\r\n| |              | || |              | | | |              | || |              | || |              | |\r\n| \'--------------\' || \'--------------\' | | \'--------------\' || \'--------------\' || \'--------------\' |\r\n \'----------------\'  \'----------------\'   \'----------------\'  \'----------------\'  \'----------------\' ");
});
