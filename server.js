/********************************************************************************
* WEB322 – Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: ___Gurleen Kaur___ Student ID: ___153611231___ Date: ___2025-09-30___
*
********************************************************************************/

const projectData = require("./modules/projects");

const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Assignment 1: Gurleen Kaur-153611231");
});

app.get("/solutions/projects", (req, res) => {
  projectData.getAllProjects()
    .then(data => res.json(data))
    .catch(err => res.status(500).send(err));
});

app.get("/solutions/projects/id-demo", (req, res) => {
  projectData.getProjectById(9)
    .then(project => res.json(project))
    .catch(err => res.status(404).send(err));
});

app.get("/solutions/projects/sector-demo", (req, res) => {
  projectData.getProjectsBySector("agriculture")
    .then(projects => res.json(projects))
    .catch(err => res.status(404).send(err));
});

projectData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error("Error", err);
  });