var winners = [
  {
    year: 2023,
    lan: 'LANiversaire',
    name: 'Yves'
  },
  {
    year: 2022,
    lan: 'PorcLAN',
    name: 'Manu2'
  },
  {
    year: 2021,
    lan: 'Jass',
    name: 'Mic & Gab'
  },
  {
    year: 2020,
    lan: 'Qui veut noober des millions',
    name: 'Séb'
  },
  {
    year: 2019,
    lan: 'Burger Quiz LAN',
    name: 'Nicolas'
  },
  {
    year: 2018,
    lan: 'Magical Mystery LAN',
    name: 'Yannick'
  },
  {
    year: 2017,
    lan: 'LANAmerica',
    name: 'Julien'
  },
  {
    year: 2016,
    lan: 'PauLANer',
    name: 'Andréa'
  },
  {
    year: 2015,
    lan: 'Battle RoyaLAN',
    name: 'Manu1'
  },
  {
    year: 2014,
    lan: 'GranLANismo',
    name: 'Séb'
  },
  {
    year: 2013,
    lan: 'MasterLAN',
    name: 'Manu1'
  },
  {
    year: 2012,
    lan: 'PekLAN Express, le bateur mystère',
    name: 'Séb'
  },
  {
    year: 2011,
    lan: 'PekLAN Express, le copier coller',
    name: 'N/A'
  },
  {
    year: 2010,
    lan: 'PekLAN Express, la route de la Whine',
    name: 'Séb'
  },
  {
    year: 2009,
    lan: 'LAN-Story 3',
    name: 'Yannick'
  },
  {
    year: 2008,
    lan: 'LAN & Conquer',
    name: 'N/A'
  },
  {
    year: 2007,
    lan: 'Koh-LANta',
    name: 'Tim'
  },
  {
    year: 2006,
    lan: 'Lan-Story 2',
    name: 'Nicolas'
  },
  {
    year: 2005,
    lan: 'Lan-Story',
    name: 'Bruno'
  }
];

var names = [
  'Mic',
  'Bastien',
  'ChristianW',
  'Manu1',
  'Cyril',
  'Nicolas',
  'Séb',
  'Tim',
  'ChristianP',
  'Gab',
  'Julien',
  'Yannick',
  'Bruno',
  'Yves',
  'Andréa',
  'Mathieu',
  'Giova',
  'Manu2'
];

function generateCL() {
  var tbodyRef = document.getElementById('tableCL').getElementsByTagName('tbody')[0];

  winners.forEach(function (winner) {
    var newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = "<th>" + winner.year + "</th>";
    newRow.insertCell().outerHTML = "<td>" + winner.lan + "</td>";
    newRow.insertCell().outerHTML = "<td>" + winner.name + "</td>";
  });
}

function generateST() {
  var tbodyRef = document.getElementById('tableSt').getElementsByTagName('tbody')[0];

  var winsByName = {};

  names.forEach(function (name) {
    winsByName[name] = { name: name, wins: 0 };
  });

  winners.forEach(function (winner) {
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
  generateCL();
  generateST();

  console.log("\r\n .----------------.  .----------------.   .----------------.  .----------------.  .----------------. \r\n| .--------------. || .--------------. | | .--------------. || .--------------. || .--------------. |\r\n| |  _________   | || |    ______    | | | | ____    ____ | || |     _____    | || |     ______   | |\r\n| | |  _   _  |  | || |  .\' ___  |   | | | ||_   \\  \/   _|| || |    |_   _|   | || |   .\' ___  |  | |\r\n| | |_\/ | | \\_|  | || | \/ .\'   \\_|   | | | |  |   \\\/   |  | || |      | |     | || |  \/ .\'   \\_|  | |\r\n| |     | |      | || | | |    ____  | | | |  | |\\  \/| |  | || |      | |     | || |  | |         | |\r\n| |    _| |_     | || | \\ `.___]  _| | | | | _| |_\\\/_| |_ | || |     _| |_    | || |  \\ `.___.\'\\  | |\r\n| |   |_____|    | || |  `._____.\'   | | | ||_____||_____|| || |    |_____|   | || |   `._____.\'  | |\r\n| |              | || |              | | | |              | || |              | || |              | |\r\n| \'--------------\' || \'--------------\' | | \'--------------\' || \'--------------\' || \'--------------\' |\r\n \'----------------\'  \'----------------\'   \'----------------\'  \'----------------\'  \'----------------\' ");
});



fetch('./members.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
