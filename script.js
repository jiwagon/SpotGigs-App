const clientId = "f3a5f2acd2d8481b9d23574b0600eb49";
const clientSecret = "12442bf082274f029cbe7729db5245f4";

// Function to obtain access token
// Reference: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
function getAccessToken(clientId, clientSecret, callback) {
    let request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Parse the response and retrieve the access token
            data = JSON.parse(this.responseText);
            accessToken = data.access_token;
            callback(accessToken); 
        }
    };

    // POST request
    request.open("POST", "https://accounts.spotify.com/api/token", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Authorization", "Basic " + btoa(clientId + ":" + clientSecret)); // Encode and set the authorization header

    // Launch the request with required parameters
    request.send("grant_type=client_credentials");
}

function getSpotifyRecommendations(accessToken, genre) {
    let request = new XMLHttpRequest();

    // Request for 20 random tracks of the specified genre
    request.open("GET", "https://api.spotify.com/v1/recommendations?limit=20&market=US&seed_genres=" + genre, true);
    request.setRequestHeader("Authorization", "Bearer " + accessToken);

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            createRecommendationsTable(data.tracks); // Create a table with the track data
        }
    };

    request.send();
}
// Get the access token and retrieve the Spotify API request
getAccessToken(clientId, clientSecret, getSpotifyRecommendations);


// Function to create an HTML table with music recommendations
function createRecommendationsTable(tracks) {

    let tableBody = document.querySelector("#tracksTable tbody");

    // Clear table
    tableBody.innerHTML = '';

    // Iterate over the tracks and create a new row for each one
    tracks.forEach(function(track) {
        // Create a new table row
        let newRow = document.createElement('tr');

        // Create and append the 'name' data
        let nameCell = document.createElement('td');
        let nameText = document.createTextNode(track.name);
        nameCell.appendChild(nameText);
        newRow.appendChild(nameCell);

        // Create and append the 'artist' data
        let artistCell = document.createElement('td');
        let artistText = document.createTextNode(track.artists[0].name); // Assuming one artist per track
        artistCell.appendChild(artistText);
        newRow.appendChild(artistCell);

        // Append the new row to the table body
        tableBody.appendChild(newRow);
    });
}

// Function to make an API call to NWS based on the user's date and location input
function getWeatherBasedOnDate() {
    let dateInput = document.getElementById('date').value;

    // Validate date format
    let dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateInput || !dateInput.match(dateFormat)) {
        alert('Please enter a valid date in yyyy-mm-dd format.');
        return;
    }

    // Hardcoded latitude and longitude for the example; you might want to get these from user input or geolocation API.
    //var latitude = '39.7456'; // for example, Washington D.C. latitude
    //var longitude = '-97.0892'; // for example, Washington D.C. longitude

    // Map the cities to their respective latitude and longitude
    var locations = {
        "State College, PA": {latitude: '40.7934', longitude: '-77.8600'},
        "Washington, DC": {latitude: '38.8951', longitude: '-77.0369'},
        "Boston, MA": {latitude: '42.3601', longitude: '-71.0589'},
        "Philadelphia, PA": {latitude: '39.9526', longitude: '-75.1652'},
        "New York, NY": {latitude: '40.7128', longitude: '-74.0060'},
        "Miami, FL": {latitude: '25.7617', longitude: '-80.1918'},
        "Los Angeles, CA": {latitude: '34.0522', longitude: '-118.2437'},
        "San Francisco, CA": {latitude: '37.7749', longitude: '-122.4194'},
        "Austin, TX": {latitude: '30.2672', longitude: '-97.7431'},
        "Honolulu, HI": {latitude: '21.3069', longitude: '-157.8583'}
    };

    // Get the selected location
    let selectedLocation = document.getElementById('locations').value;

    // Get the corresponding latitude and longitude from the locations object
    let coords = locations[selectedLocation];
    let latitude = coords.latitude;
    let longitude = coords.longitude;

    // Get the NWS API endpoint for the specific point
    let apiUrl = 'https://api.weather.gov/points/' + latitude + ',' + longitude;

    let request = new XMLHttpRequest();
    request.open("GET", apiUrl, true);
    
    request.onreadystatechange = function() {
        if (request.readyState === 4) { // 4: request finished and response is ready
            if (request.status === 200) { // request was successful
                data = JSON.parse(request.responseText);
                forecastUrl = data.properties.forecast;
                
                let forecastRequest = new XMLHttpRequest();
                forecastRequest.open("GET", forecastUrl, true);

                forecastRequest.onreadystatechange = function() {
                    if (forecastRequest.readyState === 4) { // 4: request finished and response is ready
                        if (forecastRequest.status === 200) { // request was successful
                            forecastData = JSON.parse(forecastRequest.responseText);
                            displayWeather(forecastData);
                        } else {
                            console.error('Error fetching the weather data:', forecastRequest.statusText);
                            alert('Error fetching the weather data.');                        
                        }
                    }
                };
                forecastRequest.send();
            } 
            else {
                console.error('Error fetching the weather data:', request.statusText);
                alert('Error fetching the weather data.');
            }
        }
    };
    request.send();
};

// Function to display weather - this needs to be updated to match the data structure of the NWS API response
function displayWeather(data) {
    // Log data to console for debugging
    console.log(data);

    // Get user input date
    let dateInput = document.getElementById('date').value;

    if (data.properties.periods) {
        // Filter the periods to find the one matching the user's date
        let matchingPeriods = data.properties.periods.filter(function(period) {
            // Extract dates in new format "2023-10-21" from the original format "2023-10-21T07:00:00-04:00"
            var periodDate = period.startTime.split('T')[0]; 
            return periodDate === dateInput;
        });

        if (matchingPeriods.length > 0) {
            // If there's more than one period for the day (e.g., a separate forecast for night), you could loop over them or just take the first one.
            let forecast = matchingPeriods[0];
            
            // Construct the display string
            // let displayString = forecast.name + ': ' + forecast.temperature + ' ' + forecast.temperatureUnit;
            // displayString += ', ' + forecast.windSpeed + ' ' + forecast.windDirection;
            // displayString += ', ' + forecast.shortForecast;

            document.getElementById('weather').innerHTML = "";

            // Construct the display elements
            let nameElement = document.createElement("p");
            let temperatureElement = document.createElement("p");
            let windElement = document.createElement("p");
            let forecastElement = document.createElement("p");

            // Create text nodes for each weather data point
            let nameText = document.createTextNode(`Condition: ${forecast.name}`);
            let temperatureText = document.createTextNode(`Temperature: ${forecast.temperature} ${forecast.temperatureUnit}`);
            let windText = document.createTextNode(`Wind: ${forecast.windSpeed} ${forecast.windDirection}`);
            let forecastText = document.createTextNode(`Forecast: ${forecast.shortForecast}`);

            // Append text nodes to each corresponding element
            nameElement.appendChild(nameText);
            temperatureElement.appendChild(temperatureText);
            windElement.appendChild(windText);
            forecastElement.appendChild(forecastText);

            // Select the weatherInfo div and append elements to it for display
            let weatherInfo = document.getElementById('weather');
            weatherInfo.appendChild(nameElement);
            weatherInfo.appendChild(temperatureElement);
            weatherInfo.appendChild(windElement);
            weatherInfo.appendChild(forecastElement);

            // Check the weather condition
            var condition = forecast.shortForecast.toLowerCase();

            // Set conditions using words from weather data and get Spotify recommendations for music
            if (condition.includes("clear")) 
            {
                getAccessToken(clientId, clientSecret, function(token) {
                    getSpotifyRecommendations(token, "afrobeat");
                });
            } 
            else if (condition.includes("rain") || condition.includes("thunderstorm") || condition.includes("shower"))
            {
                // If cloudy or rainy, get Spotify recommendations for Chill Jazz music
                getAccessToken(clientId, clientSecret, function(token) {
                    getSpotifyRecommendations(token, "jazz");
                });
            }
            else if (condition.includes("cloudy") || condition.includes("cloud")) 
            {
                getAccessToken(clientId, clientSecret, function(token) {
                    getSpotifyRecommendations(token, "alternative");
                });
            } 
            else if (condition.includes("sunny")) 
            {
                getAccessToken(clientId, clientSecret, function(token) {
                    getSpotifyRecommendations(token, "party");
                });
            } 
            else 
            {
                getAccessToken(clientId, clientSecret, function(token) {
                    getSpotifyRecommendations(token, "pop");
                });
            }
            
            // Insert the weather data into the page
            //document.getElementById('weather').textContent = displayString;
        } else {
            alert('No weather data available for this date.');
        }
    } else {
        alert('No weather data available.');
    }
    if (data.properties.periods) {
        var matchingPeriods = data.properties.periods.filter(function(period) {
            var periodDate = period.startTime.split('T')[0];
            return periodDate === dateInput;
        });

        if (matchingPeriods.length > 0) {
            var forecast = matchingPeriods[0];

            // Check if the weather is sunny
            if (forecast.shortForecast.toLowerCase().includes("sunny")) {
                // If sunny, get Spotify recommendations
                getAccessToken(clientId, clientSecret, getSpotifyRecommendations);
            }
        } else {
            alert('No weather data available for this date.');
        }
    } else {
        alert('No weather data available.');
    }
}

// Function to set the date input to today's date
function setToday() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var dd = String(today.getDate()).padStart(2, '0');

    var formattedToday = `${yyyy}-${mm}-${dd}`; // Constructs date in yyyy-mm-dd format
    
    document.getElementById('date').value = formattedToday;
    getWeatherBasedOnDate(); // Automatically fetch the weather for today's date
}

// Call getWeatherBasedOnDate when the web page loads to display weather for the current date initially
window.onload = function() {
};
