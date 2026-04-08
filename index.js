const FULL_STAR_ICON = '<i class="fa fa-star fa-lg" aria-hidden="true" style="color:#facf00;"></i>';
const HALF_STAR_ICON = '<i class="fa fa-star-half-o fa-lg" aria-hidden="true" style="color:#facf00;"></i>';
const PLACEHOLDER_WINNERS = new Set(['N/A', 'tbd']);

let members = [];
let tournaments = [];
let committeeMembers = [];

async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getActiveMembers() {
  return members.filter((member) => member.end === '');
}

function getSortedTournaments() {
  return [...tournaments].sort((first, second) => second.year - first.year);
}

function buildStars(wins) {
  return FULL_STAR_ICON.repeat(Math.floor(wins)) + (wins % 1 > 0 ? HALF_STAR_ICON : '');
}

function getStandings() {
  const winsByName = getActiveMembers().reduce((result, member) => {
    result[member.name] = { name: member.name, wins: 0 };
    return result;
  }, {});

  tournaments.forEach((winner) => {
    const winners = winner.name
      .split(' & ')
      .map((name) => name.trim())
      .filter((name) => name && !PLACEHOLDER_WINNERS.has(name) && winsByName[name]);

    winners.forEach((name) => {
      winsByName[name].wins += winners.length === 1 ? 1 : 0.5;
    });
  });

  return Object.values(winsByName).sort((first, second) => {
    if (second.wins === first.wins)
      return first.name.localeCompare(second.name);

    return second.wins - first.wins;
  });
}

function generateCL() {
  const tbodyRef = document.getElementById('tableCL').getElementsByTagName('tbody')[0];
  tbodyRef.innerHTML = '';

  getSortedTournaments().forEach((winner) => {
    const newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = `<th>${winner.year}</th>`;
    newRow.insertCell().outerHTML = `<td>${winner.lan}</td>`;
    newRow.insertCell().outerHTML = `<td>${winner.name}</td>`;
  });
}

function generateCommitteeMembers() {
  const committeeRef = document.getElementById('committeeMembers');

  if (!committeeRef)
    return;

  committeeRef.innerHTML = committeeMembers.map((member) => {
    return `<i class="fa fa-user" aria-hidden="true"></i> ${member.role} <i class="fa fa-arrow-right" aria-hidden="true"></i> ${member.name}`;
  }).join('<br />');
}

function generateST() {
  const tbodyRef = document.getElementById('tableSt').getElementsByTagName('tbody')[0];
  tbodyRef.innerHTML = '';

  getStandings().forEach((member) => {
    const newRow = tbodyRef.insertRow();
    const stars = buildStars(member.wins);

    newRow.insertCell().outerHTML = `<th><div class="text-center">${stars}</div></th>`;
    newRow.insertCell().outerHTML = `<td>${member.name}</td>`;
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    [members, tournaments, committeeMembers] = await Promise.all([
      loadJson('./data/members.json'),
      loadJson('./data/tournaments.json'),
      loadJson('./data/committee-members.json')
    ]);

    generateCL();
    generateST();
    generateCommitteeMembers();
  } catch (error) {
    console.error('Failed to load homepage data:', error);
  }

  if (typeof logLktBanner === 'function') {
    logLktBanner();
  }
});
