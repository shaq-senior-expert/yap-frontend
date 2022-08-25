window.addEventListener("DOMContentLoaded", (event) => {
  // console.log(process.env.GOOGLE_KEY)
  if (localStorage.getItem("current_user")) {
    App.run();
  } else {
    App.loadSignupPage();
    App.loadLoginPage();
    document.getElementById("logout").style.visibility = "hidden";
  }

  document.getElementById("welcome-tag").addEventListener("click", (e) => {
    document.getElementById("welcome-hdr").classList.add("background");
    document.getElementById("business-list").style.visibility = "visible";
    document.getElementById("write-review").style.visibility = "visible";
    document.getElementById("background").style.visibility = "visible";
    document.getElementById("business-show").innerHTML = "";
    document.getElementById("write-review-form").innerHTML = "";
    document.getElementById("results").innerHTML = "";
    document.getElementById("search-result").innerHTML = "";
    document.querySelectorAll(".bz-desc-2").forEach((i) => {
      // to get description overflow to active for all
      i.classList.remove("bz-desc-2");
      i.classList.add("bz-desc");
    });
  });

  // to prevent showing duplicate results, keep track of the names already showing up on search result
  let restaurant_names = [];

  document.getElementById("search-bar").addEventListener("input", (e) => {
    let result = [];
    if (e.target.value.length > 3) {
      fetch(`${HOME_URL}businesses`)
        .then((response) => response.json())
        .then((response) => {
          const resultDisplay = document.getElementById("search-result");
          response.forEach((obj) => {
            const business = new Business(obj);
            let search_result_exist_in_db =
              business.name.toLowerCase().indexOf(e.target.value) > -1;
            let already_in_the_list = restaurant_names.includes(business.name);
            if (search_result_exist_in_db && !already_in_the_list) {
              result.push(business);
              restaurant_names.push(business.name);
              let node = document.createElement("a");
              node.setAttribute("href", "#");
              node.setAttribute(
                "class",
                "list-group-item list-group-item-action"
              );
              node.innerText = business.name;
              node.addEventListener("click", (e) => {
                document
                  .getElementById("welcome-hdr")
                  .classList.remove("background");
                document.getElementById("search-bar").reset();
                business.loadBusiness();
                handleDescription();
                result = [];
                restaurant_names = [];
              });
              if (resultDisplay.childNodes.length < 5)
                resultDisplay.appendChild(node);
            }
          });
        });
      document.getElementById("search-bar").addEventListener("submit", (e) => {
        document.getElementById("sort").style.visibility = "hidden";
        handleDescription();
        displaySearchResult(result);
        document.getElementById("search-bar").reset();
        result = [];
        restaurant_names = [];
      });
    }
  });
});
