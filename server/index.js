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
        client_id: "bb545a7741157adf26b3",
        client_secret: "6c3c1c6a670d8f00b7c45267d8409bde1d446258",
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
    const userInfo = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    res.json(userInfo.data);
  } catch (e) {
    // res.sendStatus(400);
    res.json(e);
  }
});

app.listen(3001, () => {
  console.log("App listening on port 3001...");
});
