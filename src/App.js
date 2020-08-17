import React, { useEffect } from "react";

import { default as axios } from "axios";

import { BrowserRouter as Router, Route } from "react-router-dom";

// Auth flow
// https://docs.github.com/en/developers/apps/authorizing-oauth-apps

function App() {
  return (
    <Router>
      <div className="App">
        <h2>App component</h2>
        <Route path="/auth" exact={true} component={Auth} />
        <Route path="/callback" exact={true} component={Callback} />
      </div>
    </Router>
  );
}

function Auth() {
  const urlParams = new URLSearchParams();
  urlParams.append("client_id", "1d58c43a053635049c03");

  // Scopes: https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
  urlParams.append("scope", "user:email");
  urlParams.append("state", "12345");

  return (
    <a
      href={"https://github.com/login/oauth/authorize?" + urlParams.toString()}
    >
      Login with Github
    </a>
  );
}

function Callback(props) {
  // code=4005cfee12561eda437d&state=12345
  const searchParams = new URLSearchParams(props.location.search);
  const tempAuthCode = searchParams.get("code");
  const stateToken = searchParams.get("state");
  console.log(tempAuthCode);

  // get access token
  useEffect(() => {
    axios
      .post("http://localhost:3001/access-token", {
        code: tempAuthCode,
        state: stateToken,
      })
      .then((response) => {
        console.log(response.data);
      });
  }, [tempAuthCode, stateToken]);

  return null;
}

export default App;
