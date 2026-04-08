let members = [];
let tournaments = [];
let committeeMembers = [];

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

async function loadCommitteeMembers() {
  await fetch('./data/committee-members.json')
  .then((response) => response.json())
  .then((json) => committeeMembers = json);
}

function generateCL() {
  let tbodyRef = document.getElementById('tableCL').getElementsByTagName('tbody')[0];

  [...tournaments]
    .sort((first, second) => second.year - first.year)
    .forEach(function (winner) {
      let newRow = tbodyRef.insertRow();

      newRow.insertCell().outerHTML = "<th>" + winner.year + "</th>";
      newRow.insertCell().outerHTML = "<td>" + winner.lan + "</td>";
      newRow.insertCell().outerHTML = "<td>" + winner.name + "</td>";
    });
}

function generateCommitteeMembers() {
  let committeeRef = document.getElementById('committeeMembers');

  committeeRef.innerHTML = committeeMembers.map(function (member) {
    return '<i class="fa fa-user" aria-hidden="true"></i> ' + member.role +
      ' <i class="fa fa-arrow-right" aria-hidden="true"></i> ' + member.name;
  }).join('<br />');
}

function generateST() {
  let tbodyRef = document.getElementById('tableSt').getElementsByTagName('tbody')[0];

  let winsByName = {};
  let activeMembers = members.filter(member => member.end == "");

  activeMembers.forEach(function (member) {
    winsByName[member.name] = { name: member.name, wins: 0 };
  });

  tournaments.forEach(function (winner) {
    let splitted = winner.name.split(' & ');
    splitted.forEach(function (name) {
      let normalizedName = name.trim();

      if (normalizedName == 'N/A' || normalizedName == 'tbd' || !winsByName[normalizedName])
        return;

      if (splitted.length == 1)
        winsByName[normalizedName].wins++;
      else
        winsByName[normalizedName].wins += 0.5;
    });
  });

  let boulzWithWins = Object.keys(winsByName).map(function (key) {
    return winsByName[key];
  });

  boulzWithWins.sort(function (first, second) {
    if (second.wins == first.wins)
      return first.name.localeCompare(second.name);

    return second.wins - first.wins;
  });

  boulzWithWins.forEach(function (boulz) {
    let fullStartStr = new Array(Math.floor(boulz.wins)).fill(null).reduce((a) => a + '<i class="fa fa-star fa-lg" aria-hidden="true" style="color:#facf00;"></i>', '');
    let halfStartStr = boulz.wins % 1 > 0 ? '<i class="fa fa-star-half-o fa-lg" aria-hidden="true" style="color:#facf00;"></i>' : '';

    let newRow = tbodyRef.insertRow();
    newRow.insertCell().outerHTML = "<th><center>" + fullStartStr + halfStartStr + "</center></th>";
    newRow.insertCell().outerHTML = "<td>" + boulz.name + "</td>";
  });
}

document.addEventListener('DOMContentLoaded', function() {
  Promise.all([loadMembers(), loadTournaments(), loadCommitteeMembers()])
  .then(() => {
    generateCL();
    generateST();
    generateCommitteeMembers();
  })
  .catch((error) => console.error('Failed to load homepage data:', error));

  console.log("\r\n .----------------.  .----------------.   .----------------.  .----------------.  .----------------. \r\n| .--------------. || .--------------. | | .--------------. || .--------------. || .--------------. |\r\n| |  _________   | || |    ______    | | | | ____    ____ | || |     _____    | || |     ______   | |\r\n| | |  _   _  |  | || |  .\' ___  |   | | | ||_   \\  \/   _|| || |    |_   _|   | || |   .\' ___  |  | |\r\n| | |_\/ | | \\_|  | || | \/ .\'   \\_|   | | | |  |   \\\/   |  | || |      | |     | || |  \/ .\'   \\_|  | |\r\n| |     | |      | || | | |    ____  | | | |  | |\\  \/| |  | || |      | |     | || |  | |         | |\r\n| |    _| |_     | || | \\ `.___]  _| | | | | _| |_\\\/_| |_ | || |     _| |_    | || |  \\ `.___.\'\\  | |\r\n| |   |_____|    | || |  `._____.\'   | | | ||_____||_____|| || |    |_____|   | || |   `._____.\'  | |\r\n| |              | || |              | | | |              | || |              | || |              | |\r\n| \'--------------\' || \'--------------\' | | \'--------------\' || \'--------------\' || \'--------------\' |\r\n \'----------------\'  \'----------------\'   \'----------------\'  \'----------------\'  \'----------------\' ");
});
