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




const createCountrBox = (data) => {
  const countryContainer = document.querySelector(".city-country-container");

  data.map(
    ({ city_name, dateweather }) =>
      (countryContainer.innerHTML += `<div class="country-box">
  <h4 class="title">${city_name}</h4>
  <div class="country-box-body">
    ${dateweather[0].status_icon}
    <div>
      <p>${dateweather[0].temperature}º C</p>
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
  let countryNames = await countryApi.getData(`continents/${continent}/`);
 /* countryNames = countryNames.find(
    (item) => item.continent_name == continent
  )?.country;*/
  return countryNames?.country;
};

const getCityNames = async (countri, continent) => {
  const country = await getCountryNames(continent);
  let cities = country.find((item) => item.conutry_name == countri)?.city;
  return cities;
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
  const citiesContinent = document.querySelectorAll(".country-container");
  continentsTitle.forEach((item, index) => {
    item.innerText = continentNames[index];
    continentsLink[index].setAttribute(
      "data-continent-name",
      continentNames[index]
    );
    continentsLink[index].addEventListener("click", () => {
      localStorage.setItem(
        "continent",
        continentsLink[index].getAttribute("data-continent-name")
      );
    });
  });
  const countries = await getCountryNames(localStorage.getItem("continent"));
  countries.map(({ conutry_name, flag }) => {
    const cityDiv = document.querySelector(".city-container");
    cityDiv &&
      (cityDiv.innerHTML += `<a data-city-name=${conutry_name} href="country.html">
      <div class="city-box" >
        <span class="flag">${flag}</span>
        <h4 class="title">${conutry_name}</h4>
      </div>
    </a>`);
  });
  const cityLink = document.querySelectorAll(".city-container a");

  cityLink.forEach((item) =>
    item.addEventListener("click", () => {
      localStorage.setItem("city", item.getAttribute("data-city-name"));
    })
  );
  const cityNames = await getCityNames(
    localStorage.getItem("city"),
    localStorage.getItem("continent")
  );
  console.log(cityNames);

  createCountrBox(cityNames);
  // updateContinentList(continets);
};

main();
