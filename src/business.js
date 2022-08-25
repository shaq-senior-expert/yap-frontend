class Business {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.state = props.state;
    this.zip = props.zip;
    this.contact = props.contact;
    this.website = props.website;
    this.rating = props.rating;
    this.price = props.price;
    this.reviews = props.reviews;
    this.image_url = props.image_url;
  }

  insertBusinessesToList(appOrPrep) {
    const list = document.getElementById("business-list");
    const div = document.createElement("div");
    div.setAttribute("data-rating", `${this.rating}`);
    div.setAttribute("class", "col-lg-3 col-md-6 mb-4 w-30 p-3");
    const innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "card h-100");

    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    const image_url =
      this.image_url ||
      `http://lorempixel.com/g/400/200/food/${Math.floor(Math.random() * 11)}/`;
    img.setAttribute("src", image_url);
    img.setAttribute("alt", "Not found");
    img.setAttribute("width", "200");
    img.setAttribute("height", "200");

    const title = document.createElement("p");
    title.setAttribute("class", "card-title");
    title.innerHTML = `<b>${this.name}</b>`;

    const innerMostDiv = document.createElement("div");
    innerMostDiv.setAttribute("class", "card-body");
    // innerMostDiv.appendChild(anchor)
    innerMostDiv.appendChild(title);
    innerMostDiv.dataset.tabFor = this.id;
    createBusinessDiv(innerMostDiv, this);
    innerDiv.appendChild(img);
    innerDiv.appendChild(innerMostDiv);
    div.appendChild(innerDiv);

    const a = document.createElement("a");
    a.innerText = "Read more";
    a.classList.add("read-more");
    a.setAttribute("href", "#");
    a.addEventListener("click", (e) => {
      document.getElementById("welcome-hdr").classList.remove("background");
      e.stopPropagation();
      API.fetchBusiness(this);
      // debugger
      // sortReview();
      // setTimeout(sortReview,500)
      // document.querySelectorAll(".bz-desc").forEach(i => i.classList.remove("bz-desc") )
    });
    innerDiv.appendChild(a);

    if (appOrPrep === "app") {
      list.appendChild(div);
    } else if (appOrPrep === "prep") {
      list.prepend(div);
    }
  }

  loadBusiness() {
    const element = document.getElementById("business-list");
    const reviewButton = document.getElementById("write-review");
    const background = document.getElementById("background");
    background.style.visibility = "hidden";
    element.style.visibility = "hidden";
    reviewButton.style.visibility = "hidden";
    const div = document.createElement("div");
    div.setAttribute("class", "container-fluid");
    const reviews = document.createElement("div");
    reviews.id = "reviews-list";
    const form = document.createElement("form");
    form.setAttribute("class", "container-fluid");
    form.setAttribute("data-business-ID", this.id);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendReviewData(e, this.id, reviews);
      e.target.reset();
      API.getUpdatedRating(this.id);
    });

    reviews.innerHTML = `<p class="rating"><b>Recommended Reviews</b> </p>
        <i class="fas fa-sort fa-2x float-right" data-type="asc" onClick="sortReview(event)"></i><br>`;

    const businessShowDiv = document.getElementById("business-show");
    businessShowDiv.innerHTML = `
        <img id="bz-img" class="img-fluid" src="${this.image_url}">
        <h2>${this.name}</h2>`;

    // create business description on the business show page
    createBusinessDiv(div, this);

    this.reviews.sort((a, b) => a.rating - b.rating);

    // this.reviews.forEach(review => Review.createReview(reviews,review))

    this.reviews.forEach((review) =>
      insertReviewData(review.user, reviews, review)
    );

    div.appendChild(reviews);

    businessShowDiv.appendChild(div);
    form.innerHTML = createReviewForm();
    businessShowDiv.appendChild(form);
    // to prevent it from hiding when get back to this like from welcome yap logo click
    businessShowDiv.style.visibility = "visible";
  }
}

function createBusinessDiv(target, object) {
  const p = document.createElement("p");
  p.classList.add("bz-desc");
  // p.setAttribute("class","card-text")
  p.innerHTML = `
        <p id= "rating-${object.id}"><b>Rating:</b> ${object.rating}</p>
        <p>
        <b>Description:</b> ${object.description}<br>
        <b>Address:</b> ${object.address} ${object.state || ""} ${
    object.zip || ""
  }<br>
        <b>Website:</b> ${object.website || "Not available"}<br>
        <b>Contact:</b> ${object.contact || "Not available"}<br>
        </p>
        `;
  target.appendChild(p);
}

document.getElementById("write-review").addEventListener("click", (e) => {
  e.preventDefault();
  App.hideAllElements();
  const formDiv = document.getElementById("write-review-form");

  // create business form
  const form = document.createElement("form");
  form.id = "create-business-form";
  // for google api
  const searchForm = `
    <p>Review your favorite businesses and share your experiences with our community.</p>
    <form class="input-group mb-3" id="search-business" >
        <input id="search-bar-input" type="text" class="form-control" placeholder="Search Google" > 
        <div class="input-group-append">
        </div>
    </form> <br>
    <div id="google-search-result"></div>
    `;

  form.innerHTML = createBusinessForm();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendBusinessData(e);
    // e.target.reset();
    App.showAllBusinesses();
  });

  // for google api
  formDiv.innerHTML += searchForm;
  formDiv.appendChild(form);

  //keep count of the search result.Keep the list to 5 items only
  let result = [];
  let count = 0;
  // for google api
  document.getElementById("search-business").addEventListener("input", (e) => {
    e.stopPropagation();

    let searchTerm = e.target.value.split(" ").join("%20");
    // console.log(searchTerm)

    if (e.target.value.length === 0 || count > 5) {
      document.getElementById("google-search-result").innerHTML = "";
      count = 0;
      result = [];
    }

    if (e.target.value.length > 3) {
      fetch(
        `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchTerm}&inputtype=textquery&fields=formatted_address,name,rating,photos,price_level,geometry,opening_hours,place_id&key=AIzaSyDmArjjGoB4yQWdjrEUn5KFmgpIF7jT91U`
      )
        .then((response) => response.json())
        .then((resp) => {
          const display = document.getElementById("google-search-result");
          // result array prevent duplicates result
          if (!result.includes(`${resp.candidates[0].formatted_address}`)) {
            const details = resp.candidates[0];
            const photo_reference = details.photos[0].photo_reference;

            details[
              "image_url"
            ] = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photo_reference}&key=AIzaSyDmArjjGoB4yQWdjrEUn5KFmgpIF7jT91U`;

            display.innerHTML += `<br><br><button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#collapseExample-${resp.candidates[0].geometry.location.lat}" aria-expanded="false" aria-controls="collapseExample-${resp.candidates[0].geometry.location.lat}">
                    ${resp.candidates[0].name}
                    </button>
                    <div class="collapse" id="collapseExample-${resp.candidates[0].geometry.location.lat}">
                        <div class="card card-body">
                            <b>Name:</b> ${resp.candidates[0].name}  <br>
                            <b>Address:</b> ${resp.candidates[0].formatted_address} <br>
                            <b>Rating:</b> ${resp.candidates[0].rating} <br>
                        </div>
                    </div><br>
                    `;
            // <button type="button" class="btn btn-outline-secondary btn-sm" onclick= "fillUpForm(${resp.candidates[0]})">Add</button>
            const btn = document.createElement("button");
            btn.setAttribute("class", "btn btn-outline-secondary btn-sm");
            btn.innerText = "Add";
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              // debugger
              fillUpForm(details);

              // debugger
            });

            display.appendChild(btn);
            count++;
            result.push(`${resp.candidates[0].formatted_address}`);
            // debugger
            // console.log(resp.candidates)
          }
        });
    }
  });
});

// create business form
function createBusinessForm() {
  return `
    <div class="form-row">
        <div class="col">
            <input class="form-control" type="text" name="name"  placeholder="Name" ><br>
            Description the business : <textarea class="form-control" name="description" > </textarea><br>
            Review : <textarea class="form-control" name="review"> </textarea placeholder="Review"><br>
            Rating: <select class="form-control" name="rating" >
                        <option value=1>1</option>
                        <option value=2>2</option>
                        <option value=3>3</option>
                        <option value=4>4</option>
                        <option value=5>5</option>
                    </select>
            <input class="form-control" type="number" name="price" placeholder="Price range between 1 to 5"><br>
            <input class="form-control" type="text" name="address"  placeholder="Address"><br>        
            <input class="form-control" type="text" name="state"  placeholder="State"><br>
            <input class="form-control" type="number" name="zip" placeholder="Zip"><br>
            <input class="form-control" type="number" name="contact" placeholder="Phone number"><br>
            <input class="form-control" type="text" name="website" placeholder="Website"><br>
            <input class="form-control" type="text" name="image_url" placeholder="Link to image"><br>
        </div>
    </div>
    <input  class="btn btn-secondary" type="submit" value="Submit">
    `;
}

function sendBusinessData(e) {
  const user_id = JSON.parse(localStorage.getItem("current_user")).id;
  const content = e.target.review.value;
  const rating = e.target.rating.value;

  const business = new Business({
    name: e.target.name.value,
    description: e.target.description.value,
    address: e.target.address.value,
    state: e.target.state.value,
    zip: e.target.zip.value,
    contact: e.target.contact.value,
    website: e.target.website.value,
    image_url: e.target.image_url.value,
    price: e.target.price.value,
  });

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(business),
  };
  // debugger
  fetch(`${HOME_URL}businesses`, configObj)
    .then((response) => {
      return response.json();
    })
    .then((obj) => {
      // console.log(obj)

      const business_id = obj.id;
      const business_info = { content, rating, user_id, business_id };
      const review = new Review(business_info);
      createReviewFromNestedData(review);
    });
}

function newlyCreatedDivUpdate(business_id) {
  fetch(`${HOME_URL}businesses/${business_id}`)
    .then((response) => response.json())
    .then((object) => {
      const business = new Business(object);
      business.insertBusinessesToList("prep");
    });
}

function fillUpForm(details) {
  console.log(details);
  document.getElementById("google-search-result").innerHTML = "";
  const form = document.getElementById("create-business-form");
  form.name.value = details.name;
  form.address.value = details.formatted_address;
  form.rating.value = Math.ceil(details.rating);
  form.price.value = details.price_level;
  form.image_url.value = details.image_url;
}
