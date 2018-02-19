Northcoders News API

About

A RESTful API for Northcoders News, a news aggregation site. Built using Node.js (v8.4.0), Express.js (v4.14.0), MongoDB (v2.2.31) and Mongoose(v.4.7.0).

This API has been deployed to Heroku https://floating-tundra-71534.herokuapp.com/

Set Up
To check if Node.js is installed on your machine open a terminal window and enter:

node -v

If you do not already have Node.js installed please follow the instructions on this guide.

To check if npm is installed on your machine enter this command in you terminal window:

npm -v

If you do not have npm already installed please follow this guide to set it up.

To check if git is installed on your machine please enter the following commitng in your terminal window:

git --version

If you do not already have git installed on your machine please follow this guide.

If you do not have MongoDB already installed, please follow this guide

Installation
To run this project you will need to clone it onto your local machine and install all dependencies.

To do so use the command line to o navigate to your preferred directory on your local machine and enter the following command on the terminal window:

git clone https://github.com/steele87/BE-FT-northcoders-news

Navigate inside the folder and install all dependencies by entering the following command on your terminal window:

npm install

Enter the following command in your terminal window to connect to the database and keep it running:

mongod

Open another terminal window, navigate inside the project folder and enter the following command to populate the database:

node seed/seed.js

Finally to run the server enter the following command in your terminal window:

npm start

This will run the server on port 3000. All endpoints can be found locally on http://localhost:3000/api

Testing
To test the API navigate to the project directory and enter the following command

npm test

Testing was carried out using Mocha, Chai and Supertest

API Routes
GET /api/topics
Get all the topics

GET /api/topics/:topic_id/articles
Return all the articles for a certain topic

GET /api/articles
Returns all the articles

GET /api/articles/:article_id
Returns a JSON object with the article information for the specified article

GET /api/articles/:article_id/comments
Get all the comments for an individual article

POST /api/articles/:article_id/comments
Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"}

PUT /api/articles/:article_id
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: /api/articles/:article_id?vote=up

PUT /api/comments/:comment_id
Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: /api/comments/:comment_id?vote=down

DELETE /api/comments/:comment_id
Deletes a comment

GET /api/users
Returns all users

GET /api/users/:username
Returns a JSON object with the profile data for the specified user.