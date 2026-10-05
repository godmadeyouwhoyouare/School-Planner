require("dotenv").config();
const path = require("path");
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;
const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
const SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",

    "https://www.googleapis.com/auth/classroom.coursework.me.readonly"
];

app.get("/auth/google", function (request, response) {
    const authorizationUrl =
    oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });

    response.redirect(authorizationUrl);    
    });

app.get("/auth/google/callback", async function 
    (request, response) {
    const code = request.query.code;

    if (!code) {
        response.status(400).send("Google did not return an authorization code.");
        return;
    }
    try { 
        const result = await
        oauthClient.getToken(code);
        oauthClient.setCredentials(result.tokens);

        response.send("Google Classroom is connected.You can close this tab.");
            
    } catch (error){
        console.error("Google authorization failed:", error.message);
        response.status(500).send ("Google Classroom connection failed. Try again.");
    }

});
app.get("/api/courses", async function (request, response) {
  try {
    const classroom = google.classroom({
      version: "v1",
      auth: oauthClient
    });

app.get("/api/courses/:courseId/assignments", async function (request, response) {
  const courseId = request.params.courseId;

  try {
    const classroom = google.classroom({
      version: "v1",
      auth: oauthClient
    });

    const result = await classroom.courses.courseWork.list({
      courseId: courseId,
      courseWorkStates: ["PUBLISHED"],
      orderBy: "dueDate asc",
      pageSize: 50
    });

    response.json(result.data.courseWork || []);
  } catch (error) {
    console.error("Could not load assignments:", error.message);
    response.status(500).json({
      error: "Could not load Google Classroom assignments."
    });
  }
});

    const result = await classroom.courses.list({
      pageSize: 50,
      courseStates: ["ACTIVE"]
    });

    response.json(result.data.courses || []);
  } catch (error) {
    console.error("Could not load courses:", error.message);
    response.status(500).json({
      error: "Could not load Google Classroom courses."
    });
  }
});

app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});