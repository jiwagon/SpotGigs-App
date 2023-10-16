let data;
let pokemonArray = [];

var client_id = 'f3a5f2acd2d8481b9d23574b0600eb49';
var redirect_uri = 'http://localhost:8080/callback';


function getAPIdata() {

    // Use the XMLHttpRequest object to connect to the Pokemon API
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg", true);

    // Retrieve the default list of 20 Pokemon names
    request.onload = function () {
        if (request.status === 200) {
            data = JSON.parse(this.response);

            let select = document.querySelector("#pokemonSelect");

            console.log(`${data.results}`)
        } else {
            console.log(`Error occurred. Status: ${request.status}`);
        }
    };
    // Launch the request
    request.send();
}

// function showPokemonInfo(pokemonName) {
//     // Find the selected Pokemon in the API data
//     let selectedPokemon = data.results.find(
//         pokemon => pokemon.name === pokemonName);

//     if (selectedPokemon) {

//         // Use the XMLHttpRequest object to connect to the selected Pokemon API
//         let url = `https://pokeapi.co/api/v2/pokemon/${selectedPokemon.name}`;
//         const request = new XMLHttpRequest();
//         request.open("GET", url, true);

//         // Retrieve additional Pokemon data based on the selected pokemon
//         request.onload = function () {
//             if (request.status === 200) {
//                 let pokemonData = JSON.parse(request.response);

//                 let pokemonInfo = document.querySelector("#pokemonInfo");

//                 // Clear existing pokemon info
//                 pokemonInfo.innerHTML = "";

//                 // Create elements for name, weight, and height
//                 let nameElement = document.createElement("p");
//                 let weightElement = document.createElement("p");
//                 let heightElement = document.createElement("p");

//                 // Create text nodes for name, weight, and height
//                 let nameText = document.createTextNode(`Name: ${pokemonData.name}`);
//                 let weightText = document.createTextNode(`Weight: ${pokemonData.weight} kg`);
//                 let heightText = document.createTextNode(`Height: ${pokemonData.height} dm`);

//                 // Append text nodes to each name, weight, and height element
//                 nameElement.appendChild(nameText);
//                 weightElement.appendChild(weightText);
//                 heightElement.appendChild(heightText);

//                 // Append elements to pokemonInfo for display
//                 pokemonInfo.appendChild(nameElement);
//                 pokemonInfo.appendChild(weightElement);
//                 pokemonInfo.appendChild(heightElement);
//             } else {
//                 console.log(`Error occurred. Status: ${request.status}`);
//             }
//         };
//         // Launch the request to fetch Pokemon data
//         request.send();
//     } else {
//         console.log("Pokemon not found in the API data");
//     }
//}

// Call the function to populate the dropdown with Pokemon names
getAPIdata();


