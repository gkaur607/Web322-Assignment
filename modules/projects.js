const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");
let projects = [];
sector: matchedSector ? matchedSector.sector_name || matchedSector.name : "Unknown"

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    projects = require("../data/projects.json");
    resolve();
  });
};

module.exports.getAllProjects = function () {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) resolve(projects);
    else reject("No projects available");
  });
};

module.exports.getProjectById = function (id) {
  return new Promise((resolve, reject) => {
    const project = projects.find(p => p.id == id);
    if (project) resolve(project);
    else reject("No project found with that ID");
  });
};

module.exports.getProjectsBySector = function (sector) {
  return new Promise((resolve, reject) => {
    const filtered = projects.filter(
      p => p.sector.toLowerCase() === sector.toLowerCase()
    );
    if (filtered.length > 0) resolve(filtered);
    else reject("No projects found for this sector");
  });
};