/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: ___Gurleen Kaur___ Student ID: ___153611231___ Date: ___2025-11-09___
*
********************************************************************************/

const projects = require('./data/projectData.json');
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Projects Route
app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;
  let filtered = projects;

  if (sector) {
    filtered = projects.filter(
      p => p.sector && p.sector.toLowerCase() === sector.toLowerCase()
    );
  }

  res.render('projects', { 
    page: '/solutions/projects', 
    projects: filtered 
  });
});

// Single Project Route
app.get("/solutions/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);

  if (!project) {
    return res.status(404).render("404", { message: `Project with ID ${id} not found.` });
  }

  res.status(200).render("project", { project });
});

// Custom 404 Page
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`);
});