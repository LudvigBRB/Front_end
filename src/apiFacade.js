import settings from "./settings";

//const URL = settings.mainURL;
const URL = "http://localhost:8080/securitystarter/";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class ApiFacade {
  setToken = token => {
    //gemmer i local storage
    localStorage.setItem("jwtToken", token);
  };

  getToken = () => {
    //hvis jwToken er gemt i local storage, returner token
    return localStorage.getItem("jwtToken");
  };

  loggedIn = () => {
    //hvis token er gemt, man er logget ind, returner true
    const loggedIn = this.getToken() != null;
    return loggedIn;
  };

  logout = () => {
    localStorage.removeItem("jwtToken");
  };

  //bruges i App.js
  login = (user, pass) => {
    //logger brugeren ind
    //logger ind
    const options = this.makeOptions("POST", true, {
      //bruger makeOptions nedenunder
      username: user, //body
      password: pass
    });

    return fetch(URL + "/api/login", options) //log ind
      .then(handleHttpErrors)
      .then(res => {
        //login i LoginEndpoint.java i security projektet returnere et token efter login
        this.setToken(res.token); //gem token i local storage
      })
      .then(console.log(URL));
  };

  fetchData = () => {
    const options = this.makeOptions("GET", true); //True add's the token, already logged in
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  //makesOptions metoden
  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    }; //er problemet ikke at denne if-sætning kræver at loggedIn er true, hvilket ikke er sandt, men
    //men på den anden side der er ikke et token endnu som er sat ind?
    if (addToken && this.loggedIn()) {
      //hvis token er true, token er gemt i lokal storage og man er logget ind
      opts.headers["x-access-token"] = this.getToken(); //sæt token lig "x-access-token" i headeren
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  }
}

const facade = new ApiFacade();
export default facade;
