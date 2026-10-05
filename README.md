# Plan Your School
Plan your school is a school planner that helps students organize assignments by class, due date, and priority. Students can also connect Google Classroom, view their courses and assignments, and import assignments into their planner.
## Live planner

[Open the public planner](https://godmadeyouwhoyouare.github.io/School-Planner/)

> Note: Google Classroom importing runs locally because it requires a Node.js server. GitHub Pages hosts the front-end planner but cannot run that server.

## The problem

Keeping track of assignments across different classes is difficult, especially when assignments are posted in Google Classroom but students also want one organized personal planner.

## Features

- Add assignments manually
- Select a class, due date, and priority
- Mark assignments as completed
- Delete assignments
- Save assignments after a page refresh with local storage
- Connect to Google Classroom with Google OAuth
- View Google Classroom courses and published assignments
- Import Classroom assignments into the planner
- Avoid importing the same Classroom assignment twice
- Open an imported assignment in Google Classroom

## Built with

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Google Classroom API
- Google OAuth 2.0
- GitHub Pages for the public front-end

## Run locally

1. Clone this repository.
2. Open a terminal inside the `server` folder.
3. Install packages:

   ```bash
   npm.cmd install
4. Create server/.env with your own Google OAuth values:
Example: GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
PORT=3000

5. Start the server:
node server.js

6. Open http://localhost:3000.

## limitations
The Google Classroom integration currently runs locally through the Node.js server. The GitHub Pages website shows the planner, but GitHub Pages cannot run the server required for Google Classroom OAuth.

## Hackthon Disclosures: Pre-existing work and AI-use
The manually entered planner was started before the Hackathon. During the Hackathon, i added Google OAuth, Google classrom course and assignment importing, duplicate prevention and the Node.js/Express Backend. I used codex as a learning assistant to explaining programming concepts, debug code and help plan the implemtation. i reviewed, typed, tested and can explain/break down the final code myself.
