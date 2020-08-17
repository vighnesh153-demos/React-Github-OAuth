const axios = require("axios").default;
const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Server is up and running.</h1>");
});

// Allow user to revoke github info
// https://github.com/settings/connections/applications/bb545a7741157adf26b3

app.post("/access-token", async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: "1d58c43a053635049c03",
        client_secret: "e0d06397a030da3f95dbdd1938bac24d1ccda961",
        code: req.body.code,
        state: req.body.state,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const accessToken = tokenResponse.data["access_token"];
    // https://docs.github.com/en/rest/reference/users#list-email-addresses-for-the-authenticated-user
    const userEmails = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
    });
    const userInfo = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
    });
    res.json({
      emails: userEmails.data,
      userInfo: userInfo.data,
    });
  } catch (e) {
    // res.sendStatus(400);
    res.json(e);
  }
});

app.listen(3001, () => {
  console.log("App listening on port 3001...");
});
