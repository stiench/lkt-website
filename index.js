const FULL_STAR_ICON = '<i class="fa fa-star fa-lg" aria-hidden="true" style="color:#facf00;"></i>';
const HALF_STAR_ICON = '<i class="fa fa-star-half-o fa-lg" aria-hidden="true" style="color:#facf00;"></i>';

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

function getMembersById() {
  return members.reduce((result, member) => {
    result[member.id] = member;
    return result;
  }, {});
}

function getWinnerIds(tournament) {
  if (Array.isArray(tournament.winnerId))
    return tournament.winnerId;

  return tournament.winnerId ? [tournament.winnerId] : [];
}

function getWinnerDisplayName(tournament, membersById = getMembersById()) {
  const winnerIds = getWinnerIds(tournament);

  if (!winnerIds.length)
    return tournament.lan.toLowerCase() === 'tbd' ? 'tbd' : 'N/A';

  return winnerIds
    .map((id) => membersById[id]?.uniqueName ?? `#${id}`)
    .join(' & ');
}

function getMemberDisplayName(memberId, membersById = getMembersById()) {
  const member = membersById[memberId];

  if (!member)
    return memberId ? `#${memberId}` : '';

  return member.surname ? `${member.name} ${member.surname}` : (member.uniqueName ?? member.name);
}

function buildStars(wins) {
  return FULL_STAR_ICON.repeat(Math.floor(wins)) + (wins % 1 > 0 ? HALF_STAR_ICON : '');
}

function getStandings() {
  const winsById = getActiveMembers().reduce((result, member) => {
    result[member.id] = { id: member.id, uniqueName: member.uniqueName, wins: 0 };
    return result;
  }, {});

  tournaments.forEach((tournament) => {
    const winnerIds = getWinnerIds(tournament).filter((id) => winsById[id]);

    winnerIds.forEach((id) => {
      winsById[id].wins += winnerIds.length === 1 ? 1 : 0.5;
    });
  });

  return Object.values(winsById).sort((first, second) => {
    if (second.wins === first.wins)
      return first.uniqueName.localeCompare(second.uniqueName);

    return second.wins - first.wins;
  });
}

function generateCL() {
  const tbodyRef = document.getElementById('tableCL').getElementsByTagName('tbody')[0];
  const membersById = getMembersById();
  tbodyRef.innerHTML = '';

  getSortedTournaments().forEach((winner) => {
    const newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = `<th>${winner.year}</th>`;
    newRow.insertCell().outerHTML = `<td>${winner.lan}</td>`;
    newRow.insertCell().outerHTML = `<td>${getWinnerDisplayName(winner, membersById)}</td>`;
  });
}

function generateCommitteeMembers() {
  const committeeRef = document.getElementById('committeeMembers');
  const membersById = getMembersById();

  if (!committeeRef)
    return;

  committeeRef.innerHTML = committeeMembers.map((member) => {
    const displayName = member.memberId
      ? getMemberDisplayName(member.memberId, membersById)
      : member.name;

    return `<i class="fa fa-user" aria-hidden="true"></i> ${member.role} <i class="fa fa-arrow-right" aria-hidden="true"></i> ${displayName}`;
  }).join('<br />');
}

function generateST() {
  const tbodyRef = document.getElementById('tableSt').getElementsByTagName('tbody')[0];
  tbodyRef.innerHTML = '';

  getStandings().forEach((member) => {
    const newRow = tbodyRef.insertRow();
    const stars = buildStars(member.wins);

    newRow.insertCell().outerHTML = `<th><div class="text-center">${stars}</div></th>`;
    newRow.insertCell().outerHTML = `<td>${member.uniqueName}</td>`;
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
