import React, { Component } from "react";
import facade from "./apiFacade";

//Denne klasse logger en bruger ind og checker hvorvidt man er logget ind

//form, tager login input
//gives som props i App component nederst
//App har login metoden
class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }

  login = evt => {
    evt.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  onChange = evt => {
    //tager værdierne og sætter det ind i state
    this.setState({ [evt.target.id]: evt.target.value });
  };

  render() {
    return (
      <div>
        <h2>Login as either user or admin</h2>
        <form onSubmit={this.login} onChange={this.onChange}>
          <input placeholder="Name of user" id="username" />
          <input placeholder="Password" id="password" />
          <button>Login</button>
        </form>
      </div>
    );
  }
}

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = { dataFromServer: "Fetching!!" };
  }

  componentDidMount() {
    facade.fetchData().then(res => this.setState({ dataFromServer: res.msg }));
  }

  render() {
    return (
      <div>
        <h2>Welcome to login page</h2>
        <h3>{this.state.dataFromServer}</h3>
      </div>
    );
  }
}

//main component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  logout = () => {
    facade.logout();
    this.setState({ loggedIn: false });
  };

  login = (user, pass) => {
    facade.login(user, pass).then(this.setState({ loggedIn: true }));
  };

  render() {
    return (
      <div>
        {!this.state.loggedIn ? (
          <LogIn login={this.login} />
        ) : (
          <div>
            <LoggedIn />
            <button onClick={this.logout}>Logout</button>
          </div>
        )}
      </div>
    );
  }
}
export default App;
