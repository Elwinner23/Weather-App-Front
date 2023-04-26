class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getData = async (path) => {
    try {
      const { data } = await axios.get(`${this.baseUrl}${path}`);
      return data;
    } catch (errors) {
      console.error(errors);
    }
  };
}

const countryApi = new API("http://127.0.0.1:8000/");

const createContinentElement = (item) => {
  const continentElement = document.createElement("li");
  const link = document.createElement("a");
  link.href = "/country.html";
  link.setAttribute("data-name", item);
  link.id = "continent-link";
  link.appendChild(document.createTextNode(item));
  continentElement.appendChild(link);

  return continentElement;
};

const updateContinentList = (data) => {
  const continent = document.querySelector("ul");
  data.map((continentItem) => {
    continent.appendChild(createContinentElement(continentItem));
  });
};

const getContinens = (data) => {
  const continentsObj = {};
  data.filter(({ continent }, index) => (continentsObj[continent] = index));
  return Object.keys(continentsObj);
};

const updateCountryList = (data) => {
  const continent = document.querySelector("ul");
  data.map((continentItem) => {
    continent.appendChild(createContinentElement(continentItem));
  });
};

const getCountries = (data) =>
  data.map(({ capital, top_cities }) => {
    const countries = top_cities.map(({ name }) => name);
    countries.push(capital);
    return countries;
  });

const getCountryNameAndWeatherTemp = (data) => {
  const nameAndTempArr = data[1].top_cities.map(({ name, weather }) => ({
    name,
    temp: weather[1].temperature.high,
  }));

  nameAndTempArr.push({
    name: data[0].capital,
    temp: data[0].weather[0].temperature.high,
  });
  return nameAndTempArr;
};

const createCountrBox = (data) => {
  const countryContainer = document.querySelector(".country-container");

  data.map(
    ({ name, temp }) =>
      (countryContainer.innerHTML += `<div class="country-box">
  <h4 class="title">${name}</h4>
  <div class="country-box-body">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="115"
      height="115"
      viewBox="0 0 256 256"
    >
      <path
        fill="currentColor"
        d="M156 72a76.2 76.2 0 0 0-20.26 2.73a55.63 55.63 0 0 0-9.41-11.54l9.51-13.57a8 8 0 1 0-13.11-9.18L113.22 54A55.9 55.9 0 0 0 88 48h-1.74l-2.89-16.29a8 8 0 1 0-15.75 2.77l2.88 16.34a56.1 56.1 0 0 0-23.27 14.85l-13.62-9.53a8 8 0 1 0-9.17 13.11L38 78.77A55.55 55.55 0 0 0 32 104v1.72l-16.29 2.88a8 8 0 0 0 1.38 15.88a8.24 8.24 0 0 0 1.39-.12l16.32-2.88a55.74 55.74 0 0 0 5.86 12.42A52 52 0 0 0 76 224h80a76 76 0 0 0 0-152ZM48 104a40 40 0 0 1 72.54-23.24a76.26 76.26 0 0 0-35.62 40a52.14 52.14 0 0 0-31 4.17A40 40 0 0 1 48 104Zm108 104H76a36 36 0 1 1 4.78-71.69c-.37 2.37-.63 4.79-.77 7.23a8 8 0 0 0 16 .92a58.91 58.91 0 0 1 1.88-11.81c0-.16.09-.32.12-.48A60.06 60.06 0 1 1 156 208Z"
      />
    </svg>

    <div>
      <p>${temp}º C</p>
      <button class="details-btn">Details</button>
    </div>
  </div>
</div>`)
  );
};
const getContinentNames = async () => {
  let continentNames = await countryApi.getData("continentsAll/");
  continentNames = continentNames.map((item) => item.continent_name);
  return continentNames;
};

const getCountryNames = async (continent) => {
  let countryNames = await countryApi.getData("continentsAll/");
  countryNames = countryNames.find(
    (item) => item.continent_name == continent)?.country;
   return countryNames;
};

const main = async () => {
  /*const continets = getContinens(await countryApi.getData("/countries"));
  const countries = getCountries(await countryApi.getData("/countries"));
  const countryNameAndWeatherTemp = getCountryNameAndWeatherTemp(
    await countryApi.getData("/countries")
  );*/
  const continentNames = await getContinentNames();
  //continentsName
  const continentsTitle = document.querySelectorAll(".country-box .title");
  const continentsLink = document.querySelectorAll(".continent-container a");
  continentsTitle.forEach((item, index) => {
    item.innerText = continentNames[index];
    continentsLink[index].setAttribute(
      "data-continent-name",
      continentNames[index]
    );
    continentsLink[index].addEventListener("click", (event) => {
      localStorage.setItem("continent", event.target.innerText);
    });
  });
  const countries = await getCountryNames(localStorage.getItem("continent"));
  countries.map(({ conutry_name, flag }) => {
    const cityDiv = document.querySelector(".city-container");
    cityDiv.innerHTML += `<a href="country.html">
      <div class="city-box">
        <span class="flag">${flag}</span>
        <h4 class="title">${conutry_name}</h4>
      </div>
    </a>`;
    /*  console.log(countries[index].conutry_name);
  console.log(countries[index].flag);
*/
  });
  /*createCountrBox(countryNameAndWeatherTemp);
  updateContinentList(continets);*/
};

main();
