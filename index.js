let container = document.querySelector(".main-container");
let searchForm = document.querySelector(".search-form");
let searchInput = document.querySelector(".search-form__input");
let searchFormList = document.querySelector(".search-form__list");
let results = document.querySelector(".results");
let fragment = document.createDocumentFragment();

async function getRequest(searchText) {
  try {
    if (!searchText.trim()) {
      return (searchFormList.innerHTML = "");
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchText}`,
    );
    const result = await response.json();
    searchFormList.innerHTML = "";

    firstFiveItems = result.items.slice(0, 5);
    firstFiveItems.forEach((el) => {
      const item = document.createElement("li");
      item.classList.add("search-form__list-item");
      item.setAttribute("data-name", `${el.name}`);
      item.setAttribute("data-owner", `${el.owner.login}`);
      item.setAttribute("data-stars", `${el.stargazers_count}`);
      item.textContent = el.name;
      fragment.appendChild(item);
      searchFormList.appendChild(fragment);
    });
  } catch (error) {
    console.error("Error in getRequest:", error);
  }
}
// Функция debounce.
const debounce = (fn, debounceTime) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

// Получаем значение из слушателя.
function logSearchValue() {
  return searchInput.value;
}

// Cлушатель событя на отпускание клавиши.
searchInput.addEventListener(
  "keyup",
  debounce(function () {
    const searchText = logSearchValue();
    getRequest(searchText);
  }, 300),
);

// Слушатель события при клике на меню.
searchFormList.addEventListener("click", function (event) {
  let closestMenuItem = event.target.closest(".search-form__list-item");

  if (closestMenuItem) {
    searchInput.value = "";
    searchFormList.innerHTML = "";

    let name = closestMenuItem.getAttribute("data-name");
    let owner = closestMenuItem.getAttribute("data-owner");
    let star = closestMenuItem.getAttribute("data-stars");

    let htmlString = `
      <p>Name: ${name}</p>
      <p>Owner: ${owner}</p>
      <p>Stars: ${star}</p>
    `;

    let resultItem = document.createElement("div");
    resultItem.classList.add("results__item");
    resultItem.insertAdjacentHTML("beforeend", htmlString);
    results.appendChild(resultItem);

    let btn = document.createElement("button");

    let img = document.createElement("img");
    img.src = "img/close.png";
    img.alt = "close";

    resultItem.appendChild(btn);
    btn.appendChild(img);
    btn.addEventListener("click", resultItemRemoveButtonClick);
  }
});

// Функция для кнопки закрытия.
function resultItemRemoveButtonClick(event) {
  let currentResultDiv = event.target.closest(".results__item");
  if (currentResultDiv) {
    currentResultDiv.remove();
  }
}
