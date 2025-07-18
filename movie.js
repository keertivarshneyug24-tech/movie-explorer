
const API_KEY = "3e872d10";
let grid = document.querySelector(".movieGrid");
let placeholder = "placeholder.avif";

async function validateImgUrl(posterURL){
       try{
        const response = await fetch(posterURL,{method: 'HEAD'});
        return response.ok;
       }
       catch(error){
        return false;
       }
}
async function  displayMovie(data){
    if(data.Response==="True"){
        // data.Search.forEach((movie)=>{
            for(let movie of data.Search){
            const card = document.createElement("div");
            card.classList.add("movie-card");
            
            let poster = `http://img.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`;

            const isValid = await validateImgUrl(poster);
            if(!isValid){
                poster = placeholder;
            }
            card.innerHTML = 
            `<div id = "img">
               <img src="${poster}" alt="${movie.Title}" />
            </div>


            
            <h3 style = "color:white">${movie.Title}</h3>`;
            card.addEventListener("click",()=>{
                location.hash = `#movie/${movie.imdbID}`; //search the meaning
            })
            grid.appendChild(card);
        }
            
        }
    else{
        grid.innerHTML = `<P style = "color:white">No data found</p>`
    }

    }

async function searchMovie(){
     let query = document.querySelector(".SearchMovie").value.trim();
     const url_title =`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;

     try{
        let response = await fetch(url_title);
        let data = await response.json();
        console.log("Data fetched :" , data);
        console.log(data.Search);
        grid.innerHTML = "";
        await displayMovie(data);
     }
     catch(err){
        console.log("Something went wrong....", err);
     }
}
async function displaySingleMovie(imdbID){
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
    try{
        let response = await fetch(url);
        let movie = await response.json();
        let poster = `http://img.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`;
        const isValid = await validateImgUrl(poster);
            if(!isValid){
                poster = placeholder;
            }

        //meaning of strong tag
        grid.innerHTML = `
        <div class = "movie-details" style = "color:white">
        <div id = "img">
            <img src="${poster}" alt="${movie.Title}" />

        </div>
        <h2>${movie.Title}</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Year:</strong> ${movie.Year}</p>  
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Directors:</strong> ${movie.Directors}</p>
        </div>
        <button id = "add" onclick = "addToWatchList('${movie.imdbID}')">Add to Watchlist</button>
        <button id = "top"><a href="#top" style = "color:black">Back to Top</a></button>`;
        
    }
    catch(err){
        grid.innerHTML = `<p style = "color:white">Error in loading movie details</p>`;
    }
}
function handleRoute(){
    let hash = location.hash;
    const match = hash.match(/^#movie\/(.+)$/);
    if(match){
        const imdbID = match[1];   //this gives the exact id(property of js)
        displaySingleMovie(imdbID);
    }
    else{
        grid.innerHTML = `<p style = "color:white">Search for a movie above</p>`
    }

}
//look at this once(down)
function addToWatchList(imdbID) {
    // Get the existing watchlist from localStorage
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    // If the ID is not already in the watchlist, add it
    if (!watchlist.includes(imdbID)) {
        watchlist.push(imdbID);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Movie added to watchlist!");
    } else {
        alert("Movie already in watchlist!");
    }
}


async function loadWatchList(){
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const select = document.getElementById("watchlist");
    select.innerHTML = "";

    for(let id of watchlist){
        const url = `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`;
        let response = await fetch(url);
        let movie = await response.json();
        let option = document.createElement("option");
        option.text = movie.Title;
        option.value = movie.id;
        select.appendChild(option);
    }
    select.onchange = ()=>{
        const selectedId = select.value;
        if(selectedId){
            location.hash = `#movie/${selectedId}`;
        }
    }
}
 
 function handleLogin(e){
    e.preventDefault();
    const username = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;
    let checkbox = document.querySelector("#check");
    
    if(!checkbox.checked){
        alert("Confirm if you are a human!");
    }
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if(storedUser && storedUser.username === username && storedUser.password=== password ){
         alert("Login successful");
         window.location.href = "index.html";
    }
    else{
        alert("Invalid username or password");
    }
 }


// let loginForm = document.querySelector("#login-form");
// if (loginForm) {
//     signinForm.addEventListener("submit", function (e) {
//         e.preventDefault();
//         const email = document.querySelector("#login-email").value;
//         const username = document.querySelector("#login-username").value;
//         const password = document.querySelector("#login-password").value;
//         const checkbox = document.querySelector("#check");

//         const userData = { email, username, password };

//         if (!checkbox.checked) {
//             alert("Confirm you are a human!");
//             return;
//         }
//         if (localStorage.getItem("userData")) {
//             alert("User already signed up! Please login.");
//             return;
//         }

//         localStorage.setItem("userData", JSON.stringify(userData));
//         alert("Sign in successful! You can now login");
//         window.location.href = "index.html";
//     });
// }



let signinForm = document.querySelector("#signin-form");
if (signinForm){
signinForm.addEventListener("submit",(e)=>{
   e.preventDefault();
   let form = document.querySelector("#signin-form");
   let username = document.querySelector("#signin-username").value;
   let email = document.querySelector("#signin-email").value;
   let password = document.querySelector("#signin-password").value;
   let checkbox = document.querySelector("#check");
    const userData = {
         email: email,
         username: username,
         password: password
    };
    if(!checkbox.checked){
        alert("Confirm you are a human!")
        return;
    }
    if (localStorage.getItem("userData")) {
        alert("User already signed up! Please login.");
        return;
    }

    localStorage.setItem("userData", JSON.stringify(userData));
    alert("Sign in successful! You can now login")
    window.location.href = "login.html";

})}
window.addEventListener("hashchange",handleRoute);
window.addEventListener("load",handleRoute);
window.addEventListener("load",loadWatchList);
        




