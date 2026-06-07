function kinkSelect(category) {
  const kinks = document.querySelector("#kinks");
  if (!kinks) return;
  const options = kinks.options || kinks;
  const kl = options.length;
  for (let i = 0; i < kl; i++) {
    const opt = options[i];
    if (opt && opt.classList && opt.classList.contains(category)) {
      opt.selected = true;
    }
  }
}

function ckinkSelect(text) {
  const ck = document.querySelector("#customKinks");
  if (!ck) return;
  const options = ck.options || ck;
  const ckl = options.length;
  for (let i = 0; i < ckl; i++) {
    const opt = options[i];
    if (opt && opt.innerText == text) {
      opt.selected = true;
    }
  }
}

function kinksPlacer(categories, kinkText) {
  for (let ii = 0; ii < 4; ii++) {
    kinkSelect(categories[ii]);
    ckinkSelect(kinkText[ii]);
    const addBtn = document.querySelector("#addKink");
    if (addBtn) addBtn.click();
  }
}

function textPicker() {
  faveText = document.querySelector("#fave").value;
  yesText = document.querySelector("#yes").value;
  maybeText = document.querySelector("#maybe").value;
  noText = document.querySelector("#no").value;
  return [faveText, yesText, maybeText, noText];
}

function organiseKinks() {
  const categories = ["fave", "yes", "maybe", "no"];
  const kinkText = textPicker();
  const groupsEl = document.querySelector("#groups");
  if (!groupsEl) return;
  const listContainer = groupsEl.children[1];
  const groupCount = listContainer ? listContainer.childElementCount : 0;

  for (let j = 0; j < groupCount; j++) {
    listContainer.children[j].selected = true;
    FList.Subfetish.Ui.populateKinks();
    FList.Subfetish.Ui.Lists.Cache.recache("groups");
    kinksPlacer(categories, kinkText);
  }
}

const descEl = document.getElementById("description");
if (descEl)
  descEl.insertAdjacentHTML(
    "beforebegin",
    "<div id='kinkAutomationLabels'></div>",
  );

const labelsEl = document.querySelector("#kinkAutomationLabels");
if (labelsEl) {
  labelsEl.innerHTML = `<h3>Custom Kink Names</h3>
  <table>
    <form>
      <tr><td><label for='fave'>Fave: </label></td><td><input type='text' id='fave' name='fave'></td></tr>
      <tr><td><label for='yes'>Yes: </label></td><td><input type='text' id='yes' name='yes'></td></tr>
      <tr><td><label for='maybe'>Maybe: </label></td><td><input type='text' id='maybe' name='maybe'></td></tr>
      <tr><td><label for='no'>No: </label></td><td><input type='text' id='no' name='no'></td></tr>
      <tr><td><button id="organiseKinks">Click here to organise kinks</button></td></tr>
    </form>
  </table>`;

  const organiseBtn = document.querySelector("#organiseKinks");
  if (organiseBtn)
    organiseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      organiseKinks();
    });
}
