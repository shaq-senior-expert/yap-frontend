class Review {
    constructor(props){
        this.content = props.content
        this.rating = props.rating
        this.business_id = props.business_id
        this.user_id = props.user_id
        this.user = props.user
    }

    static createReview (target, review){
        fetch(`${HOME_URL}users/${review.user_id}`)
        .then(response => response.json())
        .then(object => {
            insertReviewData(object,target,review);
        })
    }
}

function insertReviewData(user,target,review){
    
    const current_user = JSON.parse(localStorage.getItem("current_user"))
    const div = document.createElement("div")
    div.setAttribute("data-review-id",`${review.rating}`)
    const innerDiv = document.createElement("div")


    div.setAttribute("class","card border-dark mb-3")

    innerDiv.setAttribute("class","card-body text-dark")


    const p1 = document.createElement("p")
    p1.setAttribute("class","card-header")

    const p2 = document.createElement("p")
    p2.setAttribute("class","card-title")
    p2.id = review.rating

    const p3 = document.createElement("p")
    p3.setAttribute("class","card-text")

    const btnDiv = document.createElement("div")
    btnDiv.setAttribute("class","d-grid gap-2 col-6")

    const delBtn = document.createElement("button")
    const editBtn = document.createElement("button")

    delBtn.setAttribute("class","btn btn-secondary btn-sm")
    delBtn.setAttribute("style","margin-right:16px")
    delBtn.setAttribute("Data-id",`${review.id}`)
    editBtn.setAttribute("class", "btn btn-secondary btn-sm") 
    editBtn.setAttribute("Data-id",`${review.id}`)

    // delete review from business show page

    delBtn.addEventListener("click",(e) =>{
        if(confirm("Delete?")) {
            fetch(`${HOME_URL}reviews/${e.target.dataset.id}`,{
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(resp => {
                // get the updated rating from server
                API.getUpdatedRating(review.business_id)})
            // delete the review from DOM
            e.target.parentElement.parentElement.remove()
        }
        
    })

    editBtn.addEventListener("click", e => {
        const review_id = e.target.dataset.id;
        const rating = p2.innerText.slice(-1)
        const content = p3.innerText
        // change the dataset Id to ensure that we can sort right after editing without reload
        e.target.parentElement.parentElement.dataset.reviewId = rating
        makeChangesToReview(review_id, rating,content)
    })

    p1.innerHTML = `<b>User:</b> ${user.first_name} ${user.last_name}`
    p2.innerHTML = `<b>Rating:</b>${review.rating}`
    p3.innerHTML = `${review.content}`

    delBtn.innerText = "Delete"
    editBtn.innerText = "Confirm changes"
    div.appendChild(p1)

    innerDiv.appendChild(p2)
    innerDiv.appendChild(p3)

    div.appendChild(innerDiv)
  
    // if(current_user.id === user.id){

    if(current_user.id === user.id){
        p2.setAttribute("contenteditable","true")
        p3.setAttribute("contenteditable","true")

        btnDiv.appendChild(delBtn)
        btnDiv.appendChild(editBtn)

        div.appendChild(btnDiv)
    } 

    target.appendChild(div)
}

function createReviewForm(){
    return `
    <b>Write your review here!</b>
    <div class="form-group">
    <textarea id="content" class="form-control"  name="content"> </textarea><br>
    Rating: <select class="form-control"  name="rating" id="rating">
        <option value=1>1</option>
        <option value=2>2</option>
        <option value=3>3</option>
        <option value=4>4</option>
        <option value=5>5</option>
    </select>
    </div>
    <input class="btn btn-secondary" type="submit" value="Submit">
    `
}

function sendReviewData(e,businessID,reviewsList){
    const current_user = JSON.parse(localStorage.getItem("current_user"))
    const formData = {
    content: e.target.content.value,
    rating: e.target.rating.value,
    business_id: businessID,
    user_id: current_user.id
    };

    let configObj = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(formData)
    };

    fetch(`${HOME_URL}reviews`,configObj)
    .then(response => {
    return response.json()})
    .then(obj => {
        // debugger
        //display updated rating on business show page
        API.getUpdatedRating(businessID);
        Review.createReview(reviewsList,obj);
        console.log(obj)})
}


function createReviewFromNestedData(review){
    let configObj = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(review)
    };

    fetch(`${HOME_URL}reviews`,configObj)
    .then(response => {
    return response.json()})
    .then(obj => {
        // debugger
        //after the review is created , here I am creating a new div with updated rating so that the rating show up on the index page
        newlyCreatedDivUpdate(obj.business_id)
        console.log(obj)})
}


function makeChangesToReview(review_id, rating,content) {

    const data = {
        content,
        rating 
    }

    const configObj = {  
        method: "PATCH",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    } 

    fetch(`${HOME_URL}reviews/${review_id}`,configObj)
    .then (response => response.json())
    .then (obj => {
        API.getUpdatedRating(obj.business_id);
        console.log(obj)})

}


function updateRating(obj){
    document.querySelectorAll(`#rating-${obj.id}`).forEach(rating => rating.innerHTML = `<b>Rating:</b> ${obj.rating}`)
}

function sortReview(e){
    let categoryItems = document.querySelectorAll("[data-review-id]");
    let categoryItemsArray = Array.from(categoryItems); 
    let sorter;
      if (e.target.dataset.type === "asc"){
        e.target.dataset.type = "dsc"
        sorter = (a,b) => {
        return b.dataset.reviewId - a.dataset.reviewId}
      } else {
        e.target.dataset.type = "asc"
        sorter = (a,b) => {
        return a.dataset.reviewId - b.dataset.reviewId} 
      } 
    let sorted = categoryItemsArray.sort(sorter);      
    sorted.forEach(e => document.querySelector("#reviews-list").appendChild(e))
}
