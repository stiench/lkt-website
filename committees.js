let committees = [];

async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getSortedCommittees() {
  return [...committees].sort((first, second) => second.year - first.year);
}

function renderCommitteeRows() {
  const tbodyRef = document.getElementById('tableC').getElementsByTagName('tbody')[0];
  tbodyRef.innerHTML = '';

  getSortedCommittees().forEach((committee) => {
    const newRow = tbodyRef.insertRow();

    newRow.insertCell().outerHTML = `<th>${committee.year}</th>`;
    newRow.insertCell().outerHTML = `<td>${committee.p}</td>`;
    newRow.insertCell().outerHTML = `<td>${committee.vp}</td>`;
    newRow.insertCell().outerHTML = `<td>${committee.c ?? ''}</td>`;
    newRow.insertCell().outerHTML = `<td>${committee.f ?? ''}</td>`;
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    committees = await loadJson('./data/committees.json');
    renderCommitteeRows();
  } catch (error) {
    console.error('Failed to load committees data:', error);
  }

  if (typeof logLktBanner === 'function') {
    logLktBanner();
  }
});
