const searchBoxBtn = document.querySelector("#search-btn");
const searchBox = document.querySelector(".searchBox");
const mainContainer = document.querySelector(".main-container");

searchBox.addEventListener("keypress", (event) => {
  const word = document.querySelector(".searchBox").value;
  if (event.key == "Enter" && word != "") {
    event.target.placeholder = "Search for any word...";
    event.target.style.outline = "";
    handleSearch(word);
  } else {
    // event.target.placeholder = "Empty words are not valid, try other word";
    // event.target.style.outline = "2px solid red";
  }
});

searchBoxBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const word = document.querySelector(".searchBox").value;
  handleSearch(word);
});

function handleSearch(word) {
  clearResult();

  const response = fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );

  response
    .then((responseObj) => {
      return responseObj.json();
    })
    .then((body) => {
      handleResponse(body);
    });
}

function handleResponse(polysemousWords) {
  Object.keys(polysemousWords).forEach((index) => {
    const title = polysemousWords[index].word;
    const phonetic = polysemousWords[index].phonetic;
    const audio = polysemousWords[index].phonetics.sourceUrl;
    createResult(title, phonetic, audio);

    Object.keys(polysemousWords[index].meanings).forEach((key) => {
      const meaning = polysemousWords[index].meanings[key];
      const partOfSpeech = meaning.partOfSpeech;
      const definitions = meaning.definitions;

      const definitionsGroup = [];
      Object.keys(definitions).forEach((j) => {
        const definition = definitions[j].definition;
        const example = definitions[j].example ?? "";
        // console.log(example);
        const objDefinitions = { definition: definition, example: example };
        definitionsGroup.push(objDefinitions);
      });
      const synonyms = meaning.synonyms;

      createDescription(partOfSpeech, synonyms, definitionsGroup);
    });
  });
}

function createDescription(partOfSpeech, synonyms, definitionsGroup) {
  const h2Element = document.createElement("h2");
  h2Element.classList.add("definition");
  h2Element.innerText = partOfSpeech;
  const h3Element = document.createElement("h3");
  h3Element.innerText = "Meaning";

  mainContainer.appendChild(h2Element);
  mainContainer.appendChild(h3Element);

  const definition_list = document.createElement("ul");

  for (let i = 0; i < definitionsGroup.length; i++) {
    const definition_text = document.createElement("li");
    definition_text.classList.add("definition_text");
    definition_text.innerText = definitionsGroup[i].definition;
    definition_list.appendChild(definition_text);
    console.log(definitionsGroup[i].example);
    if (definitionsGroup[i].example !== "") {
      const exampleElement = document.createElement("p");
      exampleElement.classList.add("definition_example");
      exampleElement.innerText = definitionsGroup[i].example;
      definition_text.appendChild(exampleElement);
      console.log("oi");
    }
  }
  mainContainer.appendChild(definition_list);
}

function clearResult() {
  while (mainContainer.firstChild) {
    mainContainer.firstChild.remove();
  }
}

function createResult(title, phonetic, audio) {
  const divResult = document.createElement("div");
  divResult.classList.add("result");

  const titleElement = document.createElement("h1");
  titleElement.classList.add("title");
  titleElement.innerText = title;

  const phoneticElement = document.createElement("span");
  phoneticElement.classList.add("phonetic");
  phoneticElement.innerText = phonetic;

  const btn = document.createElement("button");
  btn.classList.add("audio-play");
  const svg = document.createElement("svg");
  svg.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" class="icon-play" > <g fill="#A445ED" fill-rule="evenodd"> <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" /> <path d="M29 27v21l21-10.5z" /> </g>';

  btn.appendChild(svg);
  divResult.appendChild(titleElement);
  divResult.appendChild(phoneticElement);
  divResult.appendChild(btn);
  mainContainer.appendChild(divResult);
}