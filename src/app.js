const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabels = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabels);

  return next();
}

function validadeRepositoriesId(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository ID does not exists' });
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validadeRepositoriesId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
