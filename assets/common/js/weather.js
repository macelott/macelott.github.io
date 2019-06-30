window.addEventListener('load', () => {
  let lat, lon;
  let temperatureDegree = document.querySelector(".temperature-degree");
  let temperatureDescription = document.querySelector(".temperature-description");
  let degreeSection = document.querySelector(".degree-section");
  let temperatureSpan = document.querySelector(".degree-section span");
  let iconImage = document.querySelector("#weather-icon");
  let locationName = document.querySelector(".location-name");

  if (navigator.geolocation) {
    console.log('geolocation enabled');
    navigator.geolocation.getCurrentPosition(position => {
      lon = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = `https://cors-anywhere.herokuapp.com/`;
      const apiKey = 'f324f78376847ff1d332722772870fc0'
      const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          let temperature = data.main.temp;
          let name = data.name;
          let description = data.weather[0].description;
          let icon = data.weather[0].icon;
          const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          let farenheit = (temperature * 9/5) + 32;

          temperatureDegree.textContent = Math.round(temperature);
          temperatureDescription.textContent = description;
          locationName.textContent = name;
          iconImage.src = iconURL;
          console.log(iconURL);

          degreeSection.addEventListener('click', () => {
            if (temperatureSpan.textContent === "F") {
              temperatureSpan.textContent = "C";
              temperatureDegree.textContent = Math.round(temperature);
            } else {
              temperatureSpan.textContent = "F";
              temperatureDegree.textContent = Math.round(farenheit);
            }
          })
        })
    }, error => {
      if (error.code == error.PERMISSION_DENIED) {
        console.log('geolocation denied');
        temperatureDescription.textContent = "pls allow location access :^)";
      }
    });
  } else {
    console.log('geolocation disabled?');
  }
});