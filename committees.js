let committees = [];
let members = [];

async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getSortedCommittees() {
  return [...committees].sort((first, second) => second.year - first.year);
}

function getMembersById() {
  return members.reduce((result, member) => {
    result[member.id] = member;
    return result;
  }, {});
}

function getMemberName(memberId, membersById) {
  if (memberId == null)
    return '';

  if (typeof memberId === 'number')
    return membersById[memberId]?.name ?? `#${memberId}`;

  return memberId;
}

function renderCommitteeRows() {
  const tbodyRef = document.getElementById('tableC').getElementsByTagName('tbody')[0];
  const membersById = getMembersById();
  tbodyRef.innerHTML = '';

  getSortedCommittees().forEach((committee) => {
    const newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = `<th>${committee.year}</th>`;
    newRow.insertCell().outerHTML = `<td>${getMemberName(committee.president, membersById)}</td>`;
    newRow.insertCell().outerHTML = `<td>${getMemberName(committee.vicepresident, membersById)}</td>`;
    newRow.insertCell().outerHTML = `<td>${getMemberName(committee.cashier, membersById)}</td>`;
    newRow.insertCell().outerHTML = `<td>${getMemberName(committee.fumier, membersById)}</td>`;
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    [committees, members] = await Promise.all([
      loadJson('./data/committees.json'),
      loadJson('./data/members.json')
    ]);

    renderCommitteeRows();
  } catch (error) {
    console.error('Failed to load committees data:', error);
  }

  if (typeof logLktBanner === 'function') {
    logLktBanner();
  }
});
