const DEFAULT_EVENT_HEADERS = ['Année', 'Ou', 'Début', 'Fin'];
const HIGHLIGHT_STYLE = 'background-color: #CBF2FF;';
const CHECK_ICON = "<i class='fa fa-check fa-lg' aria-hidden='true' style='color:#008000;'></i>";

let events = [];
let members = [];

async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getAttendanceByMember() {
  return events.reduce((counts, event) => {
    event.members.forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
    });

    return counts;
  }, {});
}

function getActiveMembersSortedByAttendance() {
  const attendanceByMember = getAttendanceByMember();

  return members
    .filter((member) => member.end === '')
    .sort((first, second) => {
      const firstCount = attendanceByMember[first.name] || 0;
      const secondCount = attendanceByMember[second.name] || 0;

      if (secondCount === firstCount)
        return first.name.localeCompare(second.name);

      return secondCount - firstCount;
    });
}

function getSortedEvents() {
  return [...events].sort((first, second) => {
    const firstDate = new Date(first.start.replaceAll('-', '/')).getTime();
    const secondDate = new Date(second.start.replaceAll('-', '/')).getTime();

    return secondDate - firstDate;
  });
}

function resetTable(headerRow, bodyRef) {
  headerRow.innerHTML = DEFAULT_EVENT_HEADERS
    .map((label) => `<th>${label}</th>`)
    .join('');

  bodyRef.innerHTML = '';
}

function renderMemberHeaders(headerRow, activeMembers) {
  activeMembers.forEach((member) => {
    headerRow.insertCell().outerHTML = `<th width="70">${member.name}</th>`;
  });
}

function renderEventRows(bodyRef, activeMembers) {
  getSortedEvents().forEach((event) => {
    const newRow = bodyRef.insertRow();
    const style = event.isCDO ? '' : HIGHLIGHT_STYLE;

    newRow.insertCell().outerHTML = `<th style="${style}">${event.year}</th>`;
    newRow.insertCell().outerHTML = `<th style="${style}">${event.where}</th>`;
    newRow.insertCell().outerHTML = `<th style="${style}">${event.start}</th>`;
    newRow.insertCell().outerHTML = `<th style="${style}">${event.end}</th>`;

    activeMembers.forEach((member) => {
      const content = event.members.includes(member.name) ? CHECK_ICON : '';
      newRow.insertCell().outerHTML = `<th style="${style}">${content}</th>`;
    });
  });
}

function generateEvents() {
  const table = document.getElementById('tableEvents');
  const bodyRef = table.getElementsByTagName('tbody')[0];
  const headerRow = table.getElementsByTagName('thead')[0].rows[0];
  const activeMembers = getActiveMembersSortedByAttendance();

  resetTable(headerRow, bodyRef);
  renderMemberHeaders(headerRow, activeMembers);
  renderEventRows(bodyRef, activeMembers);
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    [events, members] = await Promise.all([
      loadJson('./data/events.json'),
      loadJson('./data/members.json')
    ]);

    generateEvents();
  } catch (error) {
    console.error('Failed to load events page data:', error);
  }

  if (typeof logLktBanner === 'function') {
    logLktBanner();
  }
});
