/* DOM SELECTION*/
const rowData = document.querySelector("#rowData");
const mealDetailsData = document.querySelector("#mealDetailsData");
const searchInputs = document.querySelector("#searchInputs");
/* DOM SELECTION */

/* FLAGS FOR VALIDATION INPUTS*/ 
let flag1 = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;
let flag5 = false;
let flag6 = false;
/* FLAGS FOR VALIDATION INPUTS*/

/* EVENT LISTENERS */
$(".toggle-icon").on("click", function () {
    toggleSideBar();
})

$("#side-bar-links li").on("click",(e) => {
    if(e.target.innerText === "Search") {
        showSearchInputs();
        toggleSideBar();
    }
    else if(e.target.innerText === "Categories") {
        showCategories();
        toggleSideBar();
    }
    else if(e.target.innerText === "Area") {
        showArea();
        toggleSideBar();
    }
    else if(e.target.innerText === "Ingredients") {
        showIngredients();
        toggleSideBar();
    }
    else if(e.target.innerText === "Contact Us") {
        showContactUs();
        toggleSideBar();
    }
})
$(document).ready(() => {
    searchByName("").then (() => {
        $(".main-loader").css("display", "none");
        $("body").css("overflow", "auto");
    })
})
/* EVENT LISTENERS */

/* UTILITES FUNCTIONS */
function toggleSideBar() {
    let leftBarWidth = $(".left").innerWidth();
    let sideBarLeft = $(".side-bar").css("left");
    if (sideBarLeft === "0px") {
        $(".side-bar").animate({ left: -leftBarWidth }, 800);
        toggleSideBarIcon();
        $(".links li").animate({ top: 200 }, 800);
    }
    else {
        $(".side-bar").animate({ left: "0px" }, 800);
        let linksLength = $(".links li").length;
        for (let i = 0; i < linksLength; i++) {
            $(".links li").eq(i).animate({ top: 0 }, (i + linksLength) * 100);
        }
        toggleSideBarIcon();
    }
}
function toggleSideBarIcon() {
    $(".toggle-icon .open").toggle();
    $(".toggle-icon .close").toggle();
}
/* UTILITES FUNCTIONS */

/* START OF MAIN DISPLAY FUNCTIONS */
function displayHomeMeals(array) {
    if (array === null || array === undefined || array.length === 0) return;
    rowData.innerHTML = ``;
    let cartona = ``;
    for (let i = 0; i < array.length ; i++) {
        cartona += `
        <div class="col-md-3 p-3">
            <div class="meal-card position-relative overflow-hidden rounded-2" onclick=getMealDetails(${array[i].idMeal})>
                <img src="${array[i].strMealThumb}" alt="meal image" class="w-100">
                <div class="overlay">
                    <h3>${array[i].strMeal}</h3>
                </div>
            </div>
        </div>`;
    }
    rowData.innerHTML = cartona;
}
function displayMealDetails(array) {
    $("#home").css("display", "none");
    $("#mealDetailsData").css("display", "flex");
    let RecipesHolder = ``;
    let emptyTag = "";
    for (let i = 1; i <= 20; i++) {
        if (array[0][`strIngredient${i}`]) {
            RecipesHolder += `
                <li class="alert alert-info m-2 p-1">${array[0][`strMeasure${i}`]}${array[0][`strIngredient${i}`]}</li>    
            `;
        }
        if(array[0].strTags == null) {
            emptyTag = "Not Tag Found!";
        }
    }
    let cartona = `
    <div class="col-md-4 p-4">
    <img src="${array[0].strMealThumb}" alt="meal logo" class="w-100 rounded-2 mb-2" />
    <h3>${array[0].strMeal}</h3>
</div>
<div class="col-md-8 position-relative p-2">
    <h2>Instructions</h2>
    <p>${array[0].strInstructions}
    </p>
    <h3><span class="fw-bold">Area:</span> ${array[0].strArea}</h3>
    <h3><span class="fw-bold">Category:</span> ${array[0].strCategory}</h3>
    <h3>Recipes:</h3>
    <ul class="list-unstyled d-flex flex-wrap">${RecipesHolder}</ul>
    <h3>Tags</h3>
    <span class="alert alert-danger d-inline-block p-2">${array[0].strTags ? array[0].strTags : emptyTag}</span>
    <div class="buttons">
    <a href="${array[0].strSource}" class="btn btn-success text-capitalize" target="_blank">source</a>
    <a href="${array[0].strYoutube}" class="btn btn-danger text-capitalize" target="_blank">youtube</a>
</div>
    <div class="toggle-icon position-absolute top-0 end-0 p-2 toggle-details">
        <i class="fa-solid fa-x fa-2x"></i>
    </div>
</div>
    `;
    mealDetailsData.innerHTML = cartona;
    $(".toggle-details").on("click", () => {
        $("#home").css("display", "block");
        $("#mealDetailsData").css("display", "none");
    })
}
async function getMealDetails(id) {
    $(".second-loader").css("display","flex");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const result = await response.json();
    displayMealDetails(result.meals.slice(0,20));
    $(".second-loader").css("display","none");
}
/* END  OF MAIN DISPLAY FUNCTIONS */

/* START OF SEARCH FUNCTONS */
function showSearchInputs () {
    searchInputs.innerHTML = `
    <div class="col-md-6">
    <input type="text" placeholder="Search By Name" class="form-control text-black input-z-index"
    onkeyup = "searchByName(this.value)">
    </div>
    <div class="col-md-6">
    <input type="text" placeholder="Search By First Letter (Max Character Length = 1)" class="form-control
    text-black input-z-index" maxlength="1" onkeyup = "searchByFirstLetter(this.value)">
    </div>
    `;
    rowData.innerHTML = ``;
}
async function searchByName(name) {

    $(".second-loader").css("display","flex");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const result = await response.json();
    displayHomeMeals(result.meals.slice(0,20));
    $(".second-loader").css("display","none");
}
async function searchByFirstLetter(letter) {
    $(".second-loader").css("display","flex");
    letter == "" ? letter = "a" : "";
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const result = await response.json();
    result.meals ? displayHomeMeals(result.meals.slice(0,20)) : result.meals = []; 
    $(".second-loader").css("display","none");
}
/* END OF SEARCH FUNCTIONS */ 

/* START OF CATEGORIES */
function displayCategory(array) {
    if (array === null || array === undefined || array.length === 0) return;
    searchInputs.innerHTML = ``;
    let cartona = ``;
    for(let i=0; i < array.length;i++) {
        cartona += `
        <div class="col-md-3 p-3">
            <div class="meal-card position-relative overflow-hidden rounded-2" onclick=getCategoryDetails('${array[i].strCategory}')>
                <img src="${array[i].strCategoryThumb}" alt="meal image" class="w-100">
                <div class="overlaycategory text-black text-center">
                    <h3 class="mb-2 p-2">${array[i].strCategory}</h3>
                    <p class="p-2">${array[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = cartona;
}
async function getCategoryDetails(category) {
    $(".second-loader").css("display","flex");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const result = await response.json();
    displayHomeMeals(result.meals.slice(0,20));
    $(".second-loader").css("display","none");
}   
async function showCategories() {
    $(".second-loader").css("display","flex");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const result = await response.json();
    displayCategory(result.categories.slice(0,20));
    $(".second-loader").css("display","none");
}
/* END   OF CATEGORIES*/  

/* START OF AREA */

async function showArea() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    const result = await response.json();
    displayShowArea(result.meals.slice(0,20));
}
function displayShowArea(array) {
    searchInputs.innerHTML = ``;
    let cartona = ``;
    for(let i=0; i < array.length; i++) {
        cartona += `
        <div class="col-md-3 text-white pointer">
        <div class="text-center" onclick="getAreaMeal('${array[i].strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${array[i].strArea}</h3>
        </div>
    </div>
        `;
    }
    rowData.innerHTML = cartona;
}
async function getAreaMeal(area) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const result = await response.json();
    displayHomeMeals(result.meals.slice(0,20));
}
/* END   OF AREA*/  

/* START OF INGRADIENTS*/
async function showIngredients() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const result = await response.json();
    displayIngradients(result.meals.slice(0,20));
}
function displayIngradients(array) {
    if (array === null || array === undefined || array.length === 0) return;
    searchInputs.innerHTML = ``;
    let cartona = ``;
    for (let i=0; i < array.length;i++) {
        cartona += `
        <div class="col-md-3 text-white pointer">
        <div onclick="getIngredientsMeals('${array[i].strIngredient}')" class="rounded-2 text-center pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${array[i].strIngredient}</h3>
                <p>${array[i].strDescription ? array[i].strDescription.split(" ").slice(0,20).join(" "):array[i].strDescription}</p>
        </div>
        </div>
        `;
    }
    rowData.innerHTML = cartona;
}
async function getIngredientsMeals(Ingredient) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`)
    const result = await response.json();
    displayHomeMeals(result.meals.slice(0,20));
}
/* END   OF INGRADIENTS*/

/* START OF VALIDATION FUNCTIONS */
function showContactUs() {
    rowData.innerHTML = `
    <div class="col-md-6">
    <input id="nameInput" onkeyup="validateName();validateButton()" type="text" class="form-control" placeholder="Enter Your Name">
    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
        Special characters and numbers not allowed
    </div>
</div>
<div class="col-md-6">
    <input id="emailInput" onkeyup="validateEmail();validateButton()" type="email" class="form-control " placeholder="Enter Your Email">
    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
        Email not valid *exemple@yyy.zzz
    </div>
</div>
<div class="col-md-6">
    <input id="phoneInput" onkeyup="validatePhone();validateButton()" type="text" class="form-control " placeholder="Enter Your Phone">
    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid Phone Number
    </div>
</div>
<div class="col-md-6">
    <input id="ageInput" onkeyup="validateAge();validateButton()" type="number" class="form-control " placeholder="Enter Your Age">
    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid age
    </div>
</div>
<div class="col-md-6">
    <input  id="passwordInput" onkeyup="validatePassword();validateButton()" type="password" class="form-control " placeholder="Enter Your Password">
    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid password *Minimum eight characters, at least one letter and one number:*
    </div>
</div>
<div class="col-md-6">
    <input  id="repasswordInput" onkeyup="repasswordValidation();validateButton()" type="password" class="form-control " placeholder="Repassword">
    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid repassword 
    </div>
</div>
<div class="col-md-12 text-center">
<button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
</div>
`;

}
function validateButton() {
    if(flag1&&flag2&&flag3&&flag4&&flag5&&flag6) {
        if(validateName() && validateEmail() && validateAge() && validatePhone && validatePassword() && repasswordValidation()) {
            document.querySelector("#submitBtn").removeAttribute("disabled");
        }else {
            document.querySelector("#submitBtn").setAttribute("disabled",true);        
        }
    }
}
function validateName() {
    flag1 = true;
    let value = document.querySelector("#nameInput").value
    let regex = /^[a-zA-Z ]+$/;
    if(regex.test(value)) {
        $("#nameAlert").addClass("d-none");
        return true;
    }
    else {
        $("#nameAlert").removeClass("d-none");
        return false;
    }
}

function validateEmail() {
    flag2 = true;
    let value = document.querySelector("#emailInput").value
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if(regex.test(value)) {
        $("#emailAlert").addClass("d-none");
        return true;
    }
    else {
        $("#emailAlert").removeClass("d-none");
        return false;
    }
}

function validatePhone() {
    flag3 = true;
    let value = document.querySelector("#phoneInput").value
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if(regex.test(value)) {
        $("#phoneAlert").addClass("d-none");
        return true;
    }
    else {
        $("#phoneAlert").removeClass("d-none");
        return false;
    }
}

function validateAge() {
    flag4 = true;
    let value = document.querySelector("#ageInput").value
    let regex =  /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
    if(regex.test(value)) {
        $("#ageAlert").addClass("d-none");
        return true;
    }
    else {
        $("#ageAlert").removeClass("d-none");
        return false;
    }
}
function validatePassword() {
    flag5 = true;
    let value = document.querySelector("#passwordInput").value
    let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/; 
    if(regex.test(value)) {
        $("#passwordAlert").addClass("d-none");
        return true;
    }
    else {
        $("#passwordAlert").removeClass("d-none");
        return false;
    }
}
function repasswordValidation() {
    flag6 = true;
    let pw = document.getElementById("repasswordInput").value;
    let rePassword =  document.getElementById("passwordInput").value;
    if (pw == rePassword) return true;
    else return false;
}
/* END  OF  VALIDATION FUNCTIONS */ 