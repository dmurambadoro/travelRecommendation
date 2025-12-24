document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  let travelJSONData = null;

  // Load JSON data
  fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
      travelJSONData = data;
      console.log("Successfully loaded data");
    })
    .catch(error => console.error("Error loading data:", error));

  // Search
  searchBtn.addEventListener("click", () => {
    const inputString = searchInput.value.trim().toLowerCase();
    resultsDiv.innerHTML = "";

    if (!travelJSONData) {
      resultsDiv.innerHTML = "<p>Loading data... please wait.</p>";
      return;
    }

    if (!inputString) {
      resultsDiv.innerHTML = "<p>Please enter a destination or keyword.</p>";
      return;
    }

    let results = [];

    // Acceptable search words are: 'country', 'temple', 'beach'
    if (inputString === "country") {
      travelJSONData.countries?.forEach(country => {
        // Limit to first 2 cities per country
        country.cities?.slice(0, 2).forEach(city => {
          results.push(city);
        });
      });
    } else if (inputString === "temple") {
      results = travelJSONData.temples?.slice(0, 2) || [];
    } else if (inputString === "beach") {
      results = travelJSONData.beaches?.slice(0, 2) || [];
    } else {
      resultsDiv.innerHTML =
        "<p>Invalid keyword! Use 'country', 'temple', or 'beach'.</p>";
      return;
    }

    // Display results
    if (results.length === 0) {
      resultsDiv.innerHTML =
        "<p>No destinations found. Try another keyword!</p>";
    } else {
      resultsDiv.innerHTML = results
        .map(
          item => `
          <div class="result-card">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <a href="#" target="_blank">
                <button id="visit">Visit</button>
              </a>
            </div>
          </div>
        `
        )
        .join("");
    }

    resultsDiv.classList.add("show-results");
  });

  // Clear results
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    resultsDiv.innerHTML = "";
    resultsDiv.classList.remove("show-results");
  });
});