const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");
let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      const data = require("../data/projects.json");
      projects = data;
      resolve();
    } catch (err) {
      reject("Unable to load projects: " + err);
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("No projects available.");
    }
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const found = projects.find(p => p.id == projectId);
    if (found) {
      resolve(found);
    } else {
      reject(`Project with id ${projectId} not found`);
    }
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const lowerSector = sector.toLowerCase();
    const matched = [];

    projects.forEach(project => {
      if (project.sector.toLowerCase().includes(lowerSector)) {
        matched.push(project);
      }
    });

    if (matched.length > 0) {
      resolve(matched);
    } else {
      reject(`No projects found in sector: ${sector}`);
    }
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector
};