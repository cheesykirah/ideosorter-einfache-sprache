function DomProxy() {
  const handler = {
    get: function (_, prop) {
      return document.getElementById(prop);
    },
  };
  return new Proxy({}, handler);
}
const {
  navToggle,
  navToggled,
  home,
  quiz,
  question,
  button1,
  button2,
  button3,
  button4,
  button5,
  quizBack,
  results,
  screenshot,
  match,
  flag,
  quote,
  resultsBack,
  lSwitch,
  rSwitch,
  create,
  createScreenshot,
  createMatch,
  createFlag,
  createQuote,
  matches,
  tree,
  about,
} = DomProxy();
const sections = ["home", "quiz", "results", "create", "about", "tree"];
const buttons = [button1, button2, button3, button4, button5];
const defaultColors = [
  "hsl(120,70%,45%)",
  "hsl(0,70%,45%)",
  "hsl(0,0%,25%)",
  "hsl(0,0%,25%)",
  "hsl(0,0%,25%)",
];
const defaultBackgroundColors = [
  "hsl(120,70%,30%)",
  "hsl(0,70%,30%)",
  "hsl(0,0%,17.5%)",
  "hsl(0,0%,17.5%)",
  "hsl(0,0%,17.5%)",
];
const defaultIcons = ["yes", "no", "none", "none", "none"];
async function fetchData() {
  try {
    const response = await fetch("./ideologies.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
matches.addEventListener("change", function () {
  r("tree", matches.options[matches.selectedIndex].text);
});
let ideologies;
(async () => {
  ideologies = await fetchData();
  for (i in ideologies) {
    var option = document.createElement("option");
    option.innerHTML = i;
    matches.appendChild(option);
  }
  list = Object.keys(ideologies);
  selectedIdeology = "";
})();
fetchData().then((ideologies) => {
  if (!ideologies) return;
  const titles = Object.keys(ideologies);
  document.querySelectorAll("grid cell").forEach((cell) => {
    const text =
      cell.childNodes.length === 1 &&
      cell.childNodes[0].nodeType === Node.TEXT_NODE
        ? cell.textContent.trim()
        : "";
    if (text && titles.includes(text)) {
      cell.style.backgroundImage = `url("./assets/flags/${text}.svg")`;
      cell.classList.add("resultCell");
      cell.onclick = () => r("tree", text);
      cell.innerHTML =
        '<span class="resultCellText">' + cell.innerText + "</span>";
    } else if (text) {
      cell.classList.add("questionCell");
    }
  });
});
function show(section = "home") {
  document.documentElement.scrollTop = 0;
  for (i of sections) {
    if (i == section) {
      eval(i).style.display = "block";
      if (section == "create") {
        createMatch.innerText = "Click to change name";
        createFlag.src = "./assets/flags/Drop.svg";
        createQuote.innerText = "Click to change quote";
        createAuthor.innerText = "Click to change author";
        createScreenshot.scrollIntoView({ behavior: "auto" });
      }
    } else {
      eval(i).style.display = "none";
    }
  }
}
show("home");
navToggled.style.display = "none";
function navigate() {
  if (navToggled.style.display == "none") {
    navToggle.src = "./assets/buttons/no.svg";
    navToggled.style.display = "block";
  } else {
    navToggle.src = "./assets/buttons/navigation.svg";
    navToggled.style.display = "none";
  }
}
function editText(element, type) {
  const newText = prompt("Enter new " + type + ":");
  if (newText != null && newText != "") {
    element.innerText = newText;
  }
}
function selectFile() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", function () {
    const selectedFile = this.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        createFlag.src = imageUrl;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("Please select an image file (SVG, PNG, JPG, etc.).");
    }
    document.body.removeChild(fileInput);
  });
  fileInput.click();
  document.body.appendChild(fileInput);
}
function dragOverHandler(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}
function dropHandler(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  const imageFile = Array.from(files).find((file) =>
    file.type.startsWith("image")
  );
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      document.getElementById("createFlag").src = imageUrl;
    };
    reader.readAsDataURL(imageFile);
  } else {
    alert("Please drop an image file (SVG, PNG, JPG, etc.).");
  }
}
function q(
  p = "",
  q = "Loading...",
  b1 = "",
  n1 = "",
  b2 = "",
  n2 = "",
  b3 = "",
  n3 = "",
  b4 = "",
  n4 = "",
  b5 = "",
  n5 = "",
  c = "",
  s = "",
  i = ""
) {
  quiz.style.display = "block";
  results.style.display = "none";
  for (x of buttons) {
    x.innerText = "";
  }
  if (i == "") {
    for (let x in buttons) {
      buttons[
        x
      ].innerHTML = `<span><img src="./assets/buttons/${defaultIcons[x]}.svg"></span>`;
    }
  } else {
    for (let x in i) {
      buttons[
        x
      ].innerHTML = `<span><img src="./assets/buttons/${i[x]}.svg"></span>`;
    }
  }
  question.innerText = q;
  button1.innerHTML += b1;
  button1.onclick = n1;
  button2.innerHTML += b2;
  button2.onclick = n2;
  button3.innerHTML += b3;
  button3.onclick = n3;
  button4.innerHTML += b4;
  button4.onclick = n4;
  button5.innerHTML += b5;
  button5.onclick = n5;
  if (p == "") {
    quizBack.onclick = () => show("home");
  } else {
    quizBack.onclick = p;
  }
  if (c === "") {
    for (let x in buttons) {
      buttons[x].style.backgroundColor = defaultColors[x];
    }
  } else {
    for (let x in c) {
      buttons[x].style.backgroundColor = c[x];
    }
  }
  if (s === "") {
    for (let x in buttons) {
      buttons[x].style.boxShadow = `0 .5vmax ${defaultBackgroundColors[x]}`;
    }
  } else {
    for (let x in s) {
      buttons[x].style.boxShadow = `0 .5vmax ${s[x]}`;
    }
  }
  for (let x of buttons) {
    x.style.display = x.innerText ? "flex" : "none";
  }
  document.documentElement.scrollTop = 0;
}
function s(ideology) {
  selected = list.indexOf(ideology);
  lSwitch.style.display = "block";
  rSwitch.style.display = "block";
  resultsBack.onclick = () => show("tree");
  if (selected > 0) {
    lSwitch.onclick = () => r("tree", list[selected - 1]);
  } else {
    lSwitch.onclick = () => r("tree", list[list.length - 1]);
  }
  if (selected < list.length - 1) {
    rSwitch.onclick = () => r("tree", list[selected + 1]);
  } else {
    rSwitch.onclick = () => r("tree", list[0]);
  }
}
document.addEventListener("keydown", (event) => {
  if (
    results.style.display == "block" &&
    (lSwitch.style.display == "block" || rSwitch.style.display == "block")
  ) {
    selected = list.indexOf(selectedIdeology);
    if (event.key === "ArrowLeft") {
      if (selected > 0) {
        r("tree", list[selected - 1]);
      } else {
        r("tree", list[list.length - 1]);
      }
    }
    if (event.key === "ArrowRight") {
      if (selected < list.length - 1) {
        r("tree", list[selected + 1]);
      } else {
        r("tree", list[0]);
      }
    }
  }
});
async function r(p, ideology) {
  selectedIdeology = ideology;
  if (ideology != "") {
    match.innerText = ideology;
    flag.src = "./assets/flags/" + ideology + ".svg";
  } else {
    match.innerText = "No ideology";
    flag.src = "./assets/flags/null.svg";
  }
  if (ideologies[ideology][0] != "") {
    quote.innerText = ideologies[ideology][0];
  } else {
    quote.innerText = "No quote";
  }
  if (ideologies[ideology][1] != "") {
    author.innerText = ideologies[ideology][1];
  } else {
    author.innerText = "No author";
  }
  if (p == "tree") {
    s(ideology);
  } else if (p == "") {
    resultsBack.onclick = () => show("home");
  } else {
    lSwitch.style.display = "none";
    rSwitch.style.display = "none";
    resultsBack.onclick = p;
  }
  show("results");
  screenshot.scrollIntoView({ behavior: "auto" });
}

// PRO-PRIVATE PROPERTY TREE

function q_privateProperty() {
  q(
    "",
    "Sollte Privateigentum existieren? (Sollten Personen und Konzerne Produktionsmittel, Ideen und Ressourcen alleine besitzen und verwalten dürfen und Entscheidungen trefen dürfen, egal wie schlecht diese für die weite Bevölkerung sind?)",
    "Ja",
    q_constitution,
    "Nein",
    q_markets
  );
}
function q_constitution() {
  q(
    q_privateProperty,
    "Sollte der Staat strikt limitiert sein in seinen Möglichkeiten?",
    "Ja",
    q_minarchy,
    "Nein",
    q_stateFunctions,
    "Der Staat sollte nicht existieren",
    q_counterEcon,
    "",
    "",
    "",
    "",
    ["hsl(120,70%,45%)", "hsl(0,70%,45%)", "hsl(280,60%,35%)"],
    ["hsl(120,70%,30%)", "hsl(0,70%,30%)", "hsl(280,60%,20%)"],
    ["yes", "no", "nostate"]
  );
}
function q_minarchy() {
  q(
    q_constitution,
    "Sollte der Staat nur das Gesetz, Eigentum und sich selbst beschützen?",
    "Ja",
    () => r(q_minarchy, "Minarchism"),
    "Nein",
    q_distBert
  );
}
function q_distBert() {
  q(
    q_minarchy,
    "Sollten Ideen, Produktionsmittel und Ressourcen so kollektiv wie möglich besitzt werden?",
    "Ja",
    () => r(q_distBert, "Libertarian distributism"),
    "Nein",
    q_singleTax
  );
}
function q_singleTax() {
  q(
    q_distBert,
    "Sollte die einzige Steuer eine Abgabe auf die Nutzung öffentlicher Ressourcen sein?",
    "Ja",
    () => r(q_singleTax, "Geolibertarianism"),
    "Nein",
    q_ubi
  );
}
function q_ubi() {
  q(
    q_singleTax,
    "Sollte es Bedingungsloses Grundeinkommen geben? (Sollte jeder monatlich etwas Geld vom Staat bekommen, ohne Anforderungen?)",
    "Ja",
    () => r(q_ubi, "Social libertarianism"),
    "Nein",
    q_bertWar
  );
}
function q_bertWar() {
  q(
    q_ubi,
    "Sollte Freiheit auf der ganzen Welt erzwungen werden?",
    "Ja",
    () => r(q_bertWar, "Neo-libertarianism"),
    "Nein",
    q_bertTrad
  );
}
function q_bertTrad() {
  q(
    q_bertWar,
    "Sollten Lokale Communities Recht und Ordnung durchsetzen?",
    "Ja",
    () => r(q_bertTrad, "Paleolibertarianism"),
    "Nein",
    () => r(q_bertTrad, "Right-libertarianism")
  );
}
function q_counterEcon() {
  q(
    q_constitution,
    "Welche Methode sollte benutzt werden um den Staat zu stürzen?",
    "Illegaler Handel",
    q_redMarket,
    "Revolution",
    q_anDist,
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(0,0%,50%)", "hsl(40,80%,50%)"],
    ["hsl(0,0%,35%)", "hsl(40,80%,35%)"],
    ["illegal trade", "insurrection"]
  );
}
function q_redMarket() {
  q(
    q_counterEcon,
    "Sollte man Märkte auf denen manche Leute zu dingen gezwungen werden dulden?",
    "Ja",
    () => r(q_redMarket, "Avaritionism"),
    "Nein",
    () => r(q_redMarket, "Agorism")
  );
}
function q_anDist() {
  q(
    q_counterEcon,
    "Sollten Ideen, Produktionsmittel und Ressourcen so kollektiv wie möglich besitzt werden?",
    "Ja",
    () => r(q_anDist, "Anarcho-distributism"),
    "Nein",
    q_landRent
  );
}
function q_landRent() {
  q(
    q_anDist,
    "Ist es Diebstahl Miete für Land zu beziehen?",
    "Ja",
    () => r(q_landRent, "Geo-anarchism"),
    "Nein",
    q_coop
  );
}
function q_coop() {
  q(
    q_landRent,
    "Sind Genossenschaften besser als hierarchische Business-Modelle?",
    "Ja",
    () => r(q_coop, "Left-rothbardianism"),
    "Nein",
    q_covenant
  );
}
function q_covenant() {
  q(
    q_coop,
    "Sollten Gemeinschaften die auf gemeinsamen Gelöbnissen oder Versprechen basieren unerwünschte Individuen ausschließen?",
    "Ja",
    q_separation,
    "Nein",
    () => r(q_covenant, "Anarcho-capitalism")
  );
}
function q_separation() {
  q(
    q_covenant,
    "Wie soll die Trennung von Bünden stattfinden?",
    "Friedlich",
    () => r(q_separation, "Hoppeanism"),
    "Aggresiv",
    () => r(q_separation, "Nilssonianism"),
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(40,100%,60%)", "hsl(25,70%,45%)"],
    ["hsl(40,100%,40%)", "hsl(25,70%,30%)"],
    ["peacefully", "aggressively"]
  );
}
function q_stateFunctions() {
  q(
    q_constitution,
    "Wer sollte staatliche Funktionen übernehmen?",
    "Gewählte Vertreter",
    q_dist,
    "Starke Person",
    q_total,
    "Souverän",
    q_sovereignType,
    "",
    "",
    "",
    "",
    ["hsl(220,70%,45%)", "hsl(350,70%,45%)", "hsl(50,70%,45%)"],
    ["hsl(220,70%,30%)", "hsl(350,70%,30%)", "hsl(50,70%,30%)"],
    ["elected officials", "strongman", "sovereign"]
  );
}
function q_dist() {
  q(
    q_stateFunctions,
    "Sollten Ideen, Produktionsmittel und Ressourcen so kollektiv wie möglich besitzt werden?",
    "Ja",
    q_distNeeds,
    "Nein",
    q_lvt
  );
}
function q_distNeeds() {
  q(
    q_dist,
    "Sollten die Bedürfnisse der Leute ohne das sie etwas dafür tun müssen erfüllt werden?",
    "Ja",
    () => r(q_distNeeds, "Social distributism"),
    "Nein",
    () => r(q_distNeeds, "Distributism")
  );
}
function q_lvt() {
  q(
    q_dist,
    "Soll das Geld aus Bodenmieten wieder an die Gesellschaft zurückfließen?",
    "Ja",
    q_geoWelf,
    "Nein",
    q_trad
  );
}
function q_geoWelf() {
  q(
    q_lvt,
    "Soll das Geld aus Bodenmieten für Soziales verwendet werden?",
    "Ja",
    () => r(q_geoWelf, "Social georgism"),
    "Nein",
    () => r(q_geoWelf, "Georgism")
  );
}
function q_trad() {
  q(
    q_lvt,
    "Sollte der Staat und die Gesellschaft Ordnung und Stabilität gegenüber allem anderen prioritisieren?",
    "Ja",
    q_safetyNet,
    "Nein",
    q_needs
  );
}
function q_safetyNet() {
  q(
    q_trad,
    "Sollte ein Soziales Sicherheitsnetz die Armen beschützen?",
    "Ja",
    q_deuxCentQuaranteSixFromages,
    "Nein",
    q_conIntervention
  );
}
function q_deuxCentQuaranteSixFromages() {
  q(
    q_safetyNet,
    "Sollte Businesses die mit den Zielen des Staates übereinstimmen promotet werden?",
    "Ja",
    () => r(q_deuxCentQuaranteSixFromages, "Dirigisme"),
    "Nein",
    () => r(q_deuxCentQuaranteSixFromages, "Paternalistic conservatism")
  );
}
function q_conIntervention() {
  q(
    q_safetyNet,
    "Sollte sich die Regierung in ausländische Kriege einmischen?",
    "Ja",
    () => r(q_conIntervention, "Mesoconservatism"),
    "Nein",
    () => r(q_conIntervention, "Paleoconservatism")
  );
}
function q_needs() {
  q(
    q_trad,
    "Sollten die Bedürfnisse der Leute ohne das sie etwas dafür tun müssen erfüllt werden??",
    "Ja",
    () => r(q_needs, "Social democracy"),
    "Nein",
    q_regulation
  );
}
function q_regulation() {
  q(
    q_needs,
    "Sollte die Wirtschaft strikt reguliert werden?",
    "Ja",
    q_bigBusiness,
    "Nein",
    q_mobility
  );
}
function q_bigBusiness() {
  q(
    q_regulation,
    "Sollten große Konzerne mehr soziale Verantwortung übernehmen?",
    "Ja",
    () => r(q_bigBusiness, "Ordoliberalism"),
    "Nein",
    () => r(q_bigBusiness, "Social liberalism")
  );
}
function q_mobility() {
  q(
    q_regulation,
    "Sollte der Staat Ausgaben tätigen, um die soziale Mobilität zu fördern?",
    "Ja",
    () => r(q_mobility, "Third way"),
    "Nein",
    q_hegemony
  );
}
function q_hegemony() {
  q(
    q_mobility,
    "Was gibt global mehr Kraft?",
    "Handel",
    () => r(q_hegemony, "Neoliberalism"),
    "Militär",
    () => r(q_hegemony, "Neoconservatism"),
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(350,70%,45%)", "hsl(230,70%,45%)"],
    ["hsl(350,70%,30%)", "hsl(230,70%,30%"],
    ["trade", "military"]
  );
}
function q_total() {
  q(
    q_stateFunctions,
    "Sollte der Staat in jedem Aspekt der Gesellschaft eine Rolle haben?",
    "Ja",
    q_racism,
    "Nein",
    q_corpo
  );
}
function q_racism() {
  q(
    q_total,
    "Sollten wir uns einer Rasse verschreiben, die allen anderen überlegen ist??",
    "Ja",
    q_raceLarp,
    "Nein",
    q_palingenesis
  );
}
function q_raceLarp() {
  q(
    q_racism,
    "Was gibt dieser Rasse diese Überlegenheit?",
    "Biologie",
    () => r(q_raceLarp, "National socialism"),
    "Geist",
    () => r(q_raceLarp, "Esoteric fascism"),
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(180,70%,40%)", "hsl(320,70%,40%)"],
    ["hsl(180,70%,25%)", "hsl(320,70%,25%)"],
    ["biology", "spirits"]
  );
}
function q_palingenesis() {
  q(
    q_racism,
    "Sollten wir die Nation durch eine Wiedergeburt sichern?",
    "Ja",
    q_fashClergy,
    "Nein",
    q_castes
  );
}
function q_fashClergy() {
  q(
    q_palingenesis,
    "Sollte der Klerus Teil der Regierung sein??",
    "Ja",
    () => r(q_fashClergy, "Clerical fascism"),
    "Nein",
    () => r(q_fashClergy, "Fascism")
  );
}
function q_castes() {
  q(
    q_palingenesis,
    "Soll die Gesellschaft in feste soziale Klassen eingeteilt werden?",
    "Ja",
    q_control,
    "Nein",
    () => r(q_castes, "Jacobinism")
  );
}
function q_control() {
  q(
    q_castes,
    "Wie sollte die Kontrolle über die Gesellschaft gesichert werden?",
    "Gleichgültigkeit",
    () => r(q_control, "Fordism"),
    "Terror",
    () => r(q_control, "Orwellianism"),
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(320,50%,65%)", "hsl(0,70%,40%)"],
    ["hsl(320,50%,55%)", "hsl(0,70%,25%)"],
    ["apathy", "terror"]
  );
}
function q_corpo() {
  q(
    q_total,
    "Sollten Berufsgruppen an der Politikgestaltung beteiligt sein??",
    "Ja",
    q_yellow,
    "Nein",
    q_natDist
  );
}
function q_yellow() {
  q(
    q_corpo,
    "Sollten Gewerkschaften in ihrem Kampf für höhere Löhne unterstützt werden??",
    "Ja",
    () => r(q_yellow, "Yellow socialism"),
    "Nein",
    () => r(q_yellow, "State corporatism")
  );
}
function q_natDist() {
  q(
    q_corpo,
    "Sollten Ideen, Produktionsmittel und Ressourcen so kollektiv wie möglich besitzt werden?",
    "Ja",
    () => r(q_natDist, "National distributism"),
    "Nein",
    q_authWelf
  );
}
function q_authWelf() {
  q(
    q_natDist,
    "Sollten gesetzestreue Bürger umfangreiche Sozialleistungen erhalten??",
    "Ja",
    () => r(q_authWelf, "Social authoritarianism"),
    "Nein",
    q_soe
  );
}
function q_soe() {
  q(
    q_authWelf,
    "Soll sich der Staat in die Verteilung von Vermögen einmischen?",
    "Ja",
    q_zeBugz,
    "Nein",
    q_klepto
  );
}
function q_zeBugz() {
  q(
    q_soe,
    "Sollten alle Akteure in Lieferketten gleichermaßen berücksichtigt werden?",
    "Ja",
    () => r(q_zeBugz, "Stakeholder capitalism"),
    "Nein",
    () => r(q_zeBugz, "State capitalism")
  );
}
function q_klepto() {
  q(
    q_soe,
    "Sollten staatliche Vorschriften große Konzerne begünstigen?",
    "Ja",
    () => r(q_klepto, "Corporatocracy"),
    "Nein",
    () => r(q_klepto, "Autocratic capitalism")
  );
}
function q_sovereignType() {
  q(
    q_stateFunctions,
    "Woran erkennt man, dass die Herrschenden das Recht haben zu herrschen?",
    "Erbe",
    q_absolute,
    "Weisheit",
    () => r(q_sovereignType, "Noocracy"),
    "Gott",
    q_guelph,
    "Auswahl",
    q_electMon,
    "Stärke",
    q_weak,
    [
      "hsl(230,70%,60%)",
      "hsl(70,70%,45%)",
      "hsl(290,70%,45%)",
      "hsl(35,80%,55%)",
      "hsl(350,70%,45%)",
    ],
    [
      "hsl(230,70%,50%)",
      "hsl(70,70%,30%)",
      "hsl(290,70%,30%)",
      "hsl(35,80%,40%)",
      "hsl(350,70%,30%)",
    ],
    ["inheritance", "wisdom", "god", "selection", "strength"]
  );
}
function q_absolute() {
  q(
    q_sovereignType,
    "Soll die Macht des Herrschers und die Macht des Staates dasselbe sein?",
    "Ja",
    () => r(q_absolute, "Absolute monarchy"),
    "Nein",
    () => r(q_absolute, "Hereditary monarchy")
  );
}
function q_guelph() {
  q(
    q_sovereignType,
    "Soll die Regierung Regeln machen, die nicht religiös sind?",
    "Ja",
    () => r(q_guelph, "Divine monarchy"),
    "Nein",
    () => r(q_guelph, "Theocracy")
  );
}
function q_electMon() {
  q(
    q_sovereignType,
    "Wer oder was bestimmt, wer Herrscher wird?",
    "Besitz von Land",
    () => r(q_electMon, "Timocracy"),
    "Aktienbesitz",
    () => r(q_electMon, "Neocameralism"),
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(255,70%,70%)", "hsl(25,80%,60%)"],
    ["hsl(255,70%,60%)", "hsl(25,80%,45%)"],
    ["land ownership", "share holding"]
  );
}
function q_weak() {
  q(
    q_sovereignType,
    "Ist es richtig, die Schwächeren zu unterdrücken?",
    "Ja",
    () => r(q_weak, "Kraterocracy"),
    "Nein",
    () => r(q_weak, "Combatocracy")
  );
}

// ANTI-PRIVATE PROPERTY TREE

function q_markets() {
  q(
    q_privateProperty,
    "Sollten Individuen und Konzerne die Freiheit haben Produkte wie sie möchten zu produzieren, verteilen und verkaufen, egal ob dies gut oder schlecht für das Volk ist?",
    "Ja",
    q_authMarkSoc,
    "Nein",
    q_communism
  );
}
function q_authMarkSoc() {
  q(
    q_markets,
    "Sollte der Staat von einer einzigen starken Partei regiert werden?",
    "Ja",
    q_lange,
    "Nein",
    q_guilds,
    "Der Staat sollte nicht existieren",
    q_mutual,
    "",
    "",
    "",
    "",
    ["hsl(120,70%,45%)", "hsl(0,70%,45%)", "hsl(280,60%,35%)"],
    ["hsl(120,70%,30%)", "hsl(0,70%,30%)", "hsl(280,60%,20%)"],
    ["yes", "no", "nostate"]
  );
}
function q_lange() {
  q(
    q_authMarkSoc,
    "Sollten zentrale Planer Ressourcen und Industriezweige zuweisen??",
    "Ja",
    () => r(q_lange, "Langean socialism"),
    "Nein",
    () => r(q_lange, "Titoism")
  );
}
function q_guilds() {
  q(
    q_authMarkSoc,
    "Sollten öffentliche Dienstleistungen im Wettbewerb zueinander stehen?",
    "Ja",
    () => r(q_guilds, "Market socialism"),
    "Nein",
    () => r(q_guilds, "Guild socialism")
  );
}
function q_mutual() {
  q(
    q_authMarkSoc,
    "Soll Geld/Handel auf gegenseitigen Schulden oder Guthaben zwischen Menschen beruhen?",
    "Ja",
    q_ethnic,
    "Nein",
    () => r(q_mutual, "Market anarchism")
  );
}
function q_ethnic() {
  q(
    q_mutual,
    "Soll eine Gruppe nur Menschen einer bestimmten Herkunft oder Ethnie haben?",
    "Ja",
    () => r(q_ethnic, "National anarchism"),
    "Nein",
    () => r(q_ethnic, "Mutualism")
  );
}
function q_communism() {
  q(
    q_markets,
    "Sollten wir eine klassenlose (jeder hat die gleichen Rechte und Möglichkeiten), geldlose (jeder tut was er kann und bekommt was er braucht), staatlose (frei vonn jeglicher Unterdrückung) Gesellschaft erreichen?",
    "Ja",
    q_commieState,
    "Nein",
    q_weed
  );
}
function q_commieState() {
  q(
    q_communism,
    "Ist ein temporärer Staats-Apparatus nötig um dieses Ziel zu erreichen?",
    "Ja",
    q_party,
    "Nein",
    q_communization
  );
}
function q_party() {
  q(
    q_commieState,
    "Sollte sich die Arbeiterklasse in einer politischen Partei organisieren?",
    "Ja",
    q_demCent,
    "Nein",
    q_commodity
  );
}
function q_demCent() {
  q(
    q_party,
    "Sollte die Organisation der Arbeiterklasse auf demokratischem Zentralismus (Alle diskutieren, entscheiden gemeinsam, dann folgt jeder der getroffenen Entscheidung.) basieren?",
    "Ja",
    q_stalinCope,
    "Nein",
    q_parliament
  );
}
function q_stalinCope() {
  q(
    q_demCent,
    "Kann Sozialismus innerhalb eines einzelnen Landes (statt nur weltweit) funktionieren?",
    "Ja",
    q_socCommodity,
    "Nein",
    q_natLib
  );
}
function q_natLib() {
  q(
    q_stalinCope,
    "Sollten unterdrückte Nationen heute für ihre Unabhängigkeit kämpfen?",
    "Ja",
    q_dws,
    "Nein",
    () => r(q_natLib, "Italian left-communism (battaglia)")
  );
}
function q_dws() {
  q(
    q_natLib,
    "Glauben Sie, dass ein Arbeiterstaat sich negativ entwickeln und korrumpiert werden kann?",
    "Ja",
    () => r(q_dws, "Orthodox trotskyism"),
    "Nein",
    () => r(q_dws, "Heterodox trotskyism")
  );
}
function q_socCommodity() {
  q(
    q_stalinCope,
    "Werden Dinge zum Verkauf hergestellt, auch wenn die Gesellschaft sozialistisch ist?",
    "Ja",
    q_peopleWar,
    "Nein",
    () => r(q_socCommodity, "Bukharinism")
  );
}
function q_peopleWar() {
  q(
    q_socCommodity,
    "Soll man einen langanhaltenden bewaffneten Aufstand machen, um das alte System zu beseitigen?",
    "Ja",
    q_universalPPW,
    "Nein",
    q_natCom
  );
}
function q_universalPPW() {
  q(
    q_peopleWar,
    "Funktionieren diese Taktiken in allen Ländern?",
    "Ja",
    () => r(q_universalPPW, "Marxism-leninism-maoism, principally maoism"),
    "Nein",
    q_laborAristocracy
  );
}
function q_laborAristocracy() {
  q(
    q_universalPPW,
    "Blockiert die Arbeiterklasse reicher Länder den gesellschaftlichen Umsturz?",
    "Ja",
    () => r(q_laborAristocracy, "Maoism-third-worldism"),
    "Nein",
    q_muhCapitalistRoaders
  );
}
function q_muhCapitalistRoaders() {
  q(
    q_laborAristocracy,
    "Hat das heutige China die kapitalistische Route genommen?",
    "Ja",
    () => r(q_muhCapitalistRoaders, "Marxism-leninism-maoism"),
    "Nein",
    () => r(q_muhCapitalistRoaders, "Marxism-leninism-mzt")
  );
}
function q_natCom() {
  q(
    q_peopleWar,
    "Sollte die Befreiung der Nation die oberste Priorität der Revolution sein?",
    "Ja",
    q_songun,
    "Nein",
    q_chinaBourgeois
  );
}
function q_chinaBourgeois() {
  q(
    q_natCom,
    "War die chinesische Revolution hauptsächlich für die Interessen der reichen Klasse?",
    "Ja",
    () => r(q_chinaBourgeois, "Anti-revisionist marxism-leninism"),
    "Nein",
    () => r(q_chinaBourgeois, "Marxism-leninism")
  );
}
function q_songun() {
  q(
    q_natCom,
    "Soll zuerst das Militär Materialien und Geld bekommen?",
    "Ja",
    () => r(q_songun, "Juche"),
    "Nein",
    () => r(q_songun, "National communism")
  );
}
function q_parliament() {
  q(
    q_demCent,
    "Sollten Kommunisten sich am Parlamentarismus (zu Wahlen antreten und in kapitalistischen Regierungen agieren) beteilligen?",
    "Ja",
    q_reform,
    "Nein",
    q_partyDict
  );
}
function q_reform() {
  q(
    q_parliament,
    "Sollen wir das jetzige System für die nahe Zukunft nur leicht ändern, statt es ganz abzuschaffen?",
    "Ja",
    () => r(q_reform, "Classical social democracy"),
    "Nein",
    () => r(q_reform, "De leonism")
  );
}
function q_partyDict() {
  q(
    q_parliament,
    "Regiert unter der Herrschaft der Arbeiterklasse nur die Partei oder die Arbeiterklasse insgesamt?",
    "Ja",
    () => r(q_partyDict, "Italian left-communism (programma)"),
    "Nein",
    q_partyElites
  );
}
function q_partyElites() {
  q(
    q_partyDict,
    "Soll nur eine kleine Gruppe besonders engagierter Leute Politik für alle machen?",
    "Ja",
    () => r(q_partyElites, "Council communism (organizational dualism)"),
    "Nein",
    () => r(q_partyElites, "Council communism (organizational unitarism)")
  );
}
function q_nature() {
  q(
    q_communization,
    "Ist ein Rückzug zum primitiven Leben das einzige Entkommen vom Kapitalismus?",
    "Ja",
    () => r(q_nature, "Camattism"),
    "Nein",
    () => r(q_nature, "Communization")
  );
}
function q_commodity() {
  q(
    q_party,
    "Soll die Revolution schon in den täglichen Handlungen und Beziehungen der Menschen beginnen?",
    "Ja",
    () => r(q_commodity, "Situationism"),
    "Nein",
    () => r(q_commodity, "Libertarian marxism")
  );
}
function q_communization() {
  q(
    q_commieState,
    "Kommunismus ist nicht nur das Ende der Revolution, sondern schon das, was in ihr passiert",
    "Ja",
    q_nature,
    "Nein",
    q_vouchers
  );
}
function q_vouchers() {
  q(
    q_communization,
    "Soll man für geleistete Arbeit Gutscheine statt Geld bekommen?",
    "Ja",
    () => r(q_vouchers, "Anarcho-collectivism"),
    "Nein",
    q_agriculture
  );
}
function q_agriculture() {
  q(
    q_vouchers,
    "Soll Landwirtschaft (Lebensmittelanbau) passieren?",
    "Ja",
    q_anarchoUnions,
    "Nein",
    () => r(q_agriculture, "Anarcho-primitivism")
  );
}
function q_anarchoUnions() {
  q(
    q_agriculture,
    "Sollte die Gesellschaft durch Gewerkschaften organisiert sein?",
    "Ja",
    q_myth,
    "Nein",
    q_bookchin
  );
}
function q_myth() {
  q(
    q_anarchoUnions,
    "Sollen wir alle an den Erfolg unserer Bewegung glauben, damit wir zusammenhalten?",
    "Ja",
    () => r(q_myth, "Sorelianism"),
    "Nein",
    () => r(q_myth, "Anarcho-syndicalism")
  );
}
function q_bookchin() {
  q(
    q_anarchoUnions,
    "Soll das Volk selbst Entscheidungen direkt vor Ort treffen, um dem Staat Macht wegzunehmen?",
    "Ja",
    () => r(q_bookchin, "Libertarian municipalism"),
    "Nein",
    q_platform
  );
}
function q_platform() {
  q(
    q_bookchin,
    "Soll eine kleine Gruppe erfahrener Leute die Arbeiter bei ihrem Kampf anleiten?",
    "Ja",
    () => r(q_platform, "Platformism"),
    "Nein",
    () => r(q_platform, "Anarcho-communism")
  );
}
function q_weed() {
  q(
    q_communism,
    "Soll man jeglichem Konflikt aus dem Weg gehen, wenn man Veränderung versucht?",
    "Ja",
    q_experts,
    "Nein",
    q_transition
  );
}
function q_experts() {
  q(
    q_weed,
    "Soll eine Gruppe Fachleute dafür sorgen, dass alle genug bekommen?",
    "Ja",
    () => r(q_experts, "Technocracy"),
    "Nein",
    () => r(q_experts, "Utopian socialism")
  );
}
function q_transition() {
  q(
    q_weed,
    "Welcher Weg soll benutzt werden um den Kapitalismus zu stürzen?",
    "Wahlen",
    () => r(q_transition, "Democratic socialism"),
    "Revolution",
    q_authSoc,
    "",
    "",
    "",
    "",
    "",
    "",
    ["hsl(335,70%,45%)", "hsl(10,70%,35%)"],
    ["hsl(335,70%,30%)", "hsl(10,70%,20%)"],
    ["election", "revolution"]
  );
}
function q_authSoc() {
  q(
    q_transition,
    "Soll Sozialismus durch zentralisierte Autorität gebaut und erhalten werden?",
    "Ja",
    q_dugin,
    "Nein",
    q_agrSoc
  );
}
function q_dugin() {
  q(
    q_authSoc,
    "Soll es mehrere gleichstarke Zivilisationen geben, statt eine dominante?",
    "Ja",
    () => r(q_dugin, "Fourth theory"),
    "Nein",
    q_natSocAuth
  );
}
function q_natSocAuth() {
  q(
    q_dugin,
    "Soll die Nation Priorität über allem anderen haben?",
    "Ja",
    q_natSynd,
    "Nein",
    () => r(q_natSocAuth, "State socialism")
  );
}
function q_natSynd() {
  q(
    q_natSocAuth,
    "Sollen vom Staat koordinierte Gewerkschaften die Gesellschaft organisieren?",
    "Ja",
    () => r(q_natSynd, "National syndicalism"),
    "Nein",
    q_daJoos
  );
}
function q_daJoos() {
  q(
    q_natSynd,
    "Hängen die soziale Schicht und die Hautfarbe stark zusammen?",
    "Ja",
    q_agrNazi,
    "Nein",
    q_nazbol
  );
}
function q_agrNazi() {
  q(
    q_daJoos,
    "Sollte Landwirtschaft der Haupt-Fokus der Wirtschaft sein?",
    "Ja",
    () => r(q_agrNazi, "Strasserism"),
    "Nein",
    () => r(q_agrNazi, "Niekischism")
  );
}
function q_nazbol() {
  q(
    q_daJoos,
    "Wie soll der Volkswille umgesetzt werden?",
    "Avantgarde",
    () => r(q_nazbol, "National bolshevism"),
    "Parlament",
    () => r(q_nazbol, "Limonovism"),
    "Direkte Demokratie",
    () => r(q_nazbol, "Third international theory"),
    "",
    "",
    "",
    "",
    ["hsl(0,70%,45%)", "hsl(340,70%,45%)", "hsl(20,70%,45%)"],
    ["hsl(0,70%,30%)", "hsl(340,70%,30%)", "hsl(20,70%,30%)"],
    ["vanguard", "parliament", "direct democracy"]
  );
}
function q_agrSoc() {
  q(
    q_authSoc,
    "Sollte die Wirtschaft auf Landwirtschaft fokkussiert sein?",
    "Ja",
    () => r(q_agrSoc, "Agrarian socialism"),
    "Nein",
    q_unions
  );
}
function q_unions() {
  q(
    q_agrSoc,
    "Sollte die Gesellschaft durch Gewerkschaften organisiert sein?",
    "Ja",
    () => r(q_unions, "Syndicalism"),
    "Nein",
    () => r(q_unions, "Libertarian socialism")
  );
}
