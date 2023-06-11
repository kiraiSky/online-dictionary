const searchBoxBtn = document.querySelector("#search-btn");
const searchBox = document.querySelector(".searchBox");
const mainContainer = document.querySelector(".main-container");
const errorContainer = document.querySelector(".error-container");

searchBox.addEventListener("keypress", (event) => {
  const word = document.querySelector(".searchBox").value;
  if (event.key == "Enter") {
    event.target.placeholder = "Search for any word...";
    event.target.style.outline = "";
    handleSearch(word);
  }
});

searchBoxBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const word = document.querySelector(".searchBox").value;
  handleSearch(word);
});

function isEmpty(word) {
  if (word === "") {
    return true;
  } else {
    return false;
  }
}

function handleSearch(word) {
  clearResult();
  if (isEmpty(word)) {
    showError();
  } else {
    const response = fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    response
      .then((responseObj) => {
        return responseObj.json();
      })
      .then((body) => {
        handleResponse(body);
      })
      .catch(() => {
        showError();
      });
  }
}

function showError() {
  errorContainer.style.display = "flex";
  searchBox.placeholder = "Empty words are not valid, please try another word.";
  searchBox.style.outline = "1px solid #ff574d";
}

function handleResponse(polysemousWords) {
  Object.keys(polysemousWords).forEach((index) => {
    const title = polysemousWords[index].word;
    const phonetic = polysemousWords[index].phonetic;
    const audio = polysemousWords[index].phonetics[0].audio;
    console.log("audio: " + audio);
    createResult(title, phonetic, audio);

    Object.keys(polysemousWords[index].meanings).forEach((key) => {
      const meaning = polysemousWords[index].meanings[key];
      const partOfSpeech = meaning.partOfSpeech;
      const definitions = meaning.definitions;

      const definitionsGroup = [];
      Object.keys(definitions).forEach((j) => {
        const definition = definitions[j].definition;
        const example = definitions[j].example ?? "";
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
    if (definitionsGroup[i].example !== "") {
      const exampleElement = document.createElement("p");
      exampleElement.classList.add("definition_example");
      exampleElement.innerText = '"' + definitionsGroup[i].example + '"';
      definition_text.appendChild(exampleElement);
    }
  }
  mainContainer.appendChild(definition_list);
  if (synonyms.length > 0) {
    const pElement = document.createElement("p");
    pElement.innerText = "Synonyms";
    pElement.classList.add("synonyms-list");

    for (let i = 0; i < synonyms.length; i++) {
      const anchorElement = document.createElement("a");
      anchorElement.classList.add("searchAnchor");
      anchorElement.innerText = synonyms[i];
      pElement.appendChild(anchorElement);
    }
    mainContainer.appendChild(pElement);
  }
}

function clearResult() {
  errorContainer.style.display = "none";
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

  // console.log(audio);
  const btn = document.createElement("button");
  btn.classList.add("audio-play");

  const audioPlayer = document.createElement("audio");
  audioPlayer.id = "audio-player";
  audioPlayer.innerHTML = `<source src="${audio}" type="audio/mpeg"> Seu navegador não suporta o elemento de áudio.`;

  btn.addEventListener("click", () => {
    audioPlayer.play();
  });

  const svg = document.createElement("svg");
  svg.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" class="icon-play" > <g fill="#A445ED" fill-rule="evenodd"> <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" /> <path d="M29 27v21l21-10.5z" /> </g>';

  btn.appendChild(svg);
  btn.appendChild(audioPlayer);
  divResult.appendChild(titleElement);
  divResult.appendChild(phoneticElement);
  divResult.appendChild(btn);
  mainContainer.appendChild(divResult);
}

const dropdownMenus = document.querySelectorAll("[data-dropdown]");

dropdownMenus.forEach((menu) => {
  menu.addEventListener("touchstart", handleClick);
  menu.addEventListener("click", handleClick);
});

function handleClick(event) {
  event.preventDefault();
  this.classList.add("active");
  outsideClick(this, () => {
    this.classList.remove("active");
  });
}

function outsideClick(element, callback) {
  const html = document.documentElement;
  const outside = "data-outside";

  if (!element.hasAttribute(outside)) {
    html.addEventListener("click", handleOutsideClick);
    element.setAttribute(outside, "");

    function handleOutsideClick(event) {
      if (!element.contains(event.target)) {
        callback();
        element.removeAttribute(outside);
        html.removeEventListener("click", handleOutsideClick);
      }
    }
  }
}

handleSearch("keyboard");
