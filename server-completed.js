var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());

var resources = {};
var resourceCounts = {};

app.get("/:resource", (req, res) => {
  const { resource } = req.params;

  if (!resources[resource]) {
    return res.status(404).send({ error: "Resource not found" });
  }

  res.send(resources[resource]);
  console.log(`Fetched all items in resource: ${resource}`);
});

app.get("/:resource/:id", (req, res) => {
  const { resource, id } = req.params;

  if (!resources[resource]) {
    return res.status(404).send({ error: "Resource not found" });
  }

  const item = resources[resource].find((r) => r.id == id);
  if (item) {
    res.send(item);
    console.log(`Fetched item with id ${id} from resource: ${resource}`);
  } else {
    res.status(404).send({ error: "Item not found" });
  }
});

app.post("/:resource", (req, res) => {
  const { resource } = req.params;

  if (!resources[resource]) {
    resources[resource] = [];
    resourceCounts[resource] = 0;
  }

  const newItem = { id: resourceCounts[resource], ...req.body };
  resourceCounts[resource]++;

  resources[resource].push(newItem);

  console.log(`Added new item to resource: ${resource}`);
  res.status(201).send(newItem);
});

app.put("/:resource/:id", (req, res) => {
  const { resource, id } = req.params;

  if (!resources[resource]) {
    return res.status(404).send({ error: "Resource not found" });
  }

  const index = resources[resource].findIndex((r) => r.id == id);
  if (index !== -1) {
    resources[resource][index] = { ...resources[resource][index], ...req.body };
    res.send(resources[resource][index]);
    console.log(`Updated item with id ${id} in resource: ${resource}`);
  } else {
    res.status(404).send({ error: "Item not found" });
  }
});

app.delete("/:resource/:id", (req, res) => {
  const { resource, id } = req.params;

  if (!resources[resource]) {
    return res.status(404).send({ error: "Resource not found" });
  }

  const index = resources[resource].findIndex((r) => r.id == id);
  if (index !== -1) {
    const deletedItem = resources[resource].splice(index, 1)[0];
    res.send(deletedItem);
    console.log(`Deleted item with id ${id} from resource: ${resource}`);
  } else {
    res.status(404).send({ error: "Item not found" });
  }
});

app.use("/", (req, res) => {
  res.status(404).send({ error: "Route not found" });
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
