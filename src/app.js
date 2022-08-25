class App {
  static run() {
    App.showAllBusinesses();
    API.getAllBusinesses();
  }

  static loadSignupPage() {
    App.hideAllElements();
    const div = document.getElementById("signup-div");
    const form = document.createElement("form");
    form.setAttribute("class", "form-group");
    form.id = "signupForm";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      User.sendUserData(e);
      e.target.reset();
      document.getElementById("signup-div").style.visibility = "hidden";
      App.run();
    });
    form.innerHTML = `
        <input class="form-control"  type="text" placeholder="Enter first name" name="first_name" required><br>
        <input class="form-control"  type="text" placeholder="Enter last name" name="last_name" required><br>
        <input class="form-control"  type="email" placeholder="Enter your email" name="email" required><br>
        <button class="btn btn-secondary" type="submit">Sign Up</button>
        `;
    div.appendChild(form);
  }

  static hideAllElements() {
    document.getElementById("welcome-hdr").classList.remove("background");
    document.getElementById("background").style.visibility = "hidden";
    document.getElementById("write-review").style.visibility = "hidden";
    document.getElementById("business-list").style.visibility = "hidden";
    document.getElementById("business-show").style.visibility = "hidden";
    document.getElementById("sort").style.visibility = "hidden";
  }

  static showAllBusinesses() {
    document.getElementById("welcome-hdr").classList.add("background");
    document.getElementById("background").style.visibility = "visible";
    document.getElementById("signup-div").innerHTML = "";
    document.getElementById("login-div").innerHTML = "";
    document.getElementById("write-review-form").innerHTML = "";
    document.getElementById("write-review").style.visibility = "visible";
    document.getElementById("business-list").style.visibility = "visible";
    document.getElementById("business-show").innerHTML = "";
    document.getElementById("sort").style.visibility = "visible";
    document.getElementById("logout").style.visibility = "visible";
  }

  static loadLoginPage() {
    const div = document.getElementById("login-div");
    const form = document.createElement("form");
    const demo = () => {
      const obj = {
        id: 25,
        first_name: "Joslyn",
        last_name: "Treutel",
        email: "edgardo@hegmann.org",
      };
      localStorage.setItem("current_user", JSON.stringify(obj));
      App.run();
    };
    form.setAttribute("class", "form-group");
    form.id = "loginForm";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      User.getUserData(e);
      e.target.reset();
      document.getElementById("login-div").style.visibility = "hidden";
      App.run();
    });
    form.innerHTML = `
        <input type="text" class="form-control" placeholder="Enter your email" name="email" required><br>
        <button class="btn btn-secondary" type="submit">Login</button>
        `;
    div.appendChild(form);

    const btn = document.createElement("button");
    btn.classList = "btn btn-secondary";
    btn.onclick = demo;
    btn.innerText = "Demo";

    div.appendChild(btn);
  }
}

const displaySearchResult = (result) => {
  // reset the result display div to prevent old results from showing up
  const result_display = document.querySelector("#results");
  if (result_display.childElementCount > 1) {
    result_display.firstChild.remove();
  }
  document.getElementById("search-result").innerHTML = "";
  App.hideAllElements();
  result.forEach((object) => {
    const div = document.createElement("div");
    const anchor = document.createElement("a");

    anchor.setAttribute("href", "#");
    anchor.addEventListener("click", (e) => {
      e.stopPropagation();
      //hide image when go from search result page to show page
      document.getElementById("welcome-hdr").classList.remove("background");
      API.fetchBusiness(object);
      document.getElementById("results").innerHTML = "";
      document.getElementById("sort").style.visibility = "hidden";
    });
    anchor.innerText = object.name;
    div.appendChild(anchor);
    div.dataset.tabFor = object.id;
    createBusinessDiv(div, object);

    document.getElementById("results").appendChild(div);
  });
};

handleDescription = () => {
  document.querySelectorAll(".bz-desc").forEach((i) => {
    // when business show page load , remove the overflow hidden to prevent description from cutting out
    i.classList.remove("bz-desc");
    i.classList.add("bz-desc-2");
  });
};

logout = () => {
  localStorage.removeItem("current_user");
  document.getElementById("login-div").style.visibility = "visible";
  document.getElementById("logout").style.visibility = "hidden";
  App.loadSignupPage();
  App.loadLoginPage();
};

document.getElementById("sort").onclick = (e) => {
  let categoryItems = document.querySelectorAll("[data-rating]");
  let categoryItemsArray = Array.from(categoryItems);
  let sorter;
  if (e.target.dataset.type === "asc") {
    e.target.dataset.type = "dsc";
    sorter = (a, b) => {
      return b.dataset.rating - a.dataset.rating;
    };
  } else {
    e.target.dataset.type = "asc";
    sorter = (a, b) => {
      return a.dataset.rating - b.dataset.rating;
    };
  }
  let sorted = categoryItemsArray.sort(sorter);
  sorted.forEach((e) =>
    document.querySelector("#business-list").appendChild(e)
  );
};
