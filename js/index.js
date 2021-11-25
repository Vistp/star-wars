const rootEl = document.querySelector(".root");
const wrapTableEl = document.querySelector(".wrapper");
const buttonEl = document.querySelector(".button");
const buttonTextEl = document.querySelector(".button__text");
const buttonRemoveEl = document.querySelector(".button--remove");
const notificationEl = document.querySelector(".notification");
const loaderEl = document.querySelector(".loader");

buttonEl.addEventListener("click", onButtonClick);
buttonRemoveEl.addEventListener("click", onRemoveButtonClick);
wrapTableEl.addEventListener("click", onDeliteRowClick);

// класс для запроса данных ====
class FetchApi {
  constructor() {
    this.baseUrl = "https://swapi.dev/api/";
  }

  fetchData() {
    const url = `${this.baseUrl}people`;
    return fetch(url).then((response) => response.json());
  }
}
const fetchApi = new FetchApi();

// Проверяем при перезагрузке, есть ли в хранилище данные ======
function isGetData() {
  if (!localStorage.getItem("currentData")) {
    return;
  }
  showRemoveButton();
  renderData();
}

isGetData();

// функция отрисовки данных, которые есть в хранилище =====
function renderData() {
  const dataHeros = localStorage.getItem("currentData");
  const herosParse = JSON.parse(dataHeros);
  rootEl.innerHTML = createMarkap(herosParse);
}

// получение данных при клике на кнопку =====
function onButtonClick() {
  showLoader();

  fetchApi
    .fetchData()
    .then((data) => {
      addMarkap(data.results);
      saveInLocalStorage(data.results);
      hideLoader();
      showRemoveButton();
    })
    .catch(onFetchError);
}

// обработка ошибки =====
function onFetchError() {
  alert("Что-то пошло не так... Повторите попытку");
  hideLoader();
}

//функция рендера отрисованных строк =====
function addMarkap(arr) {
  const markapTableRows = createMarkap(arr);
  rootEl.innerHTML = markapTableRows;
}

//добавление данных в хранилище =====
function saveInLocalStorage(arr) {
  localStorage.setItem("currentData", JSON.stringify(arr));
}

// Общая функция для отрисовки строк
// 1 - данных полученых с сервера
// 2 - данных, взятых  из хранилища

function createMarkap(heros) {
  return heros
    .map(({ created, name, gender, height, mass, hair_color }) => {
      return `
                <tr id=${created}>
                    <td>${name}</td>
                    <td>${gender}</td>
                    <td>${height}</td>
                    <td>${mass}</td>
                    <td>${hair_color}</td>
                    <td>
                        <button type="button" class="button button--delite">
                        </button>
                    </td>
                </tr>
            `;
    })
    .join("");
}

function showRemoveButton() {
  wrapTableEl.classList.remove("visually-hidden");
  buttonRemoveEl.classList.remove("visually-hidden");
  notificationEl.classList.add("visually-hidden");
}

// удалить всю таблицу, вернуть кнопку запроса =====
function onRemoveButtonClick() {
  rootEl.innerHTML = "";
  wrapTableEl.classList.add("visually-hidden");
  buttonRemoveEl.classList.add("visually-hidden");
  notificationEl.classList.remove("visually-hidden");
  localStorage.removeItem("currentData");
}

// для удаления построчно =====
function onDeliteRowClick(event) {
  if (!event.target.classList.contains("button--delite")) {
    return;
  }
  event.target.closest("tr").remove();

  const delitRowId = event.target.closest("tr").id;
  const dataHeros = localStorage.getItem("currentData");
  const herosParse = JSON.parse(dataHeros);

  let updateHeros = herosParse.filter((el) => el.created !== delitRowId);
  localStorage.setItem("currentData", JSON.stringify(updateHeros));

  if (updateHeros.length === 0) {
    onRemoveButtonClick();
  }
}

// функции показа и скрытия загрузчика =====
function showLoader() {
  loaderEl.classList.remove("visually-hidden");
  buttonTextEl.textContent = "Загрузка";
}

function hideLoader() {
  loaderEl.classList.add("visually-hidden");
  buttonTextEl.textContent = "Загрузить данные";
}
