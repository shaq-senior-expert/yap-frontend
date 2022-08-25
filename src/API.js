// const HOME_URL = "http://localhost:3000/";
const HOME_URL = "https://yap-api.herokuapp.com/";

class API {
  static getAllBusinesses() {
    fetch(`${HOME_URL}businesses`)
      .then((response) => response.json())
      .then((response) => {
        response.forEach((obj) => {
          const business = new Business(obj);
          business.insertBusinessesToList("app");
        });
      });
  }

  static fetchBusiness(object) {
    fetch(`${HOME_URL}businesses/${object.id}`)
      .then((response) => response.json())
      .then((response) => {
        const business = new Business(response);
        business.loadBusiness();
        handleDescription();
      });
  }

  static getUpdatedRating(id) {
    fetch(`${HOME_URL}businesses/${id}`)
      .then((response) => response.json())
      .then((response) => {
        // debugger
        updateRating(response);
      });
  }
}
