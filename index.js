const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let toDos = [
  {
    title: "Workout",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer to",
    completed: false,
    id: "0",
  },
  {
    title: "Study math",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    completed: false,
    id: "1",
  },
  {
    title: "Get a haircut",
    description: "Straight to the point",
    completed: true,
    id: "2",
  },
  {
    title: "Pack Suitcase",
    description: "Yes clothes need to be arranged",
    completed: true,
    id: "3",
  },
];
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);
app.get("/todos", (req, res) => {
  res.send(toDos);
});

app.get("/todos/:id", (req, res) => {
  const target = toDos.find((todo) => todo.id == req.params.id);
  res.send(target);
});

app.post("/todos", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  // const completed = req.body.completed;
  if (!title || !description)
    return res.status(400).json({
      error: "title, description or completed is missing",
    });
  else if (!toDos.find((todo) => todo.title === title)) {
    toDos = [
      ...toDos,
      {
        title,
        description,
        id: uuidv4(),
        completed: false,
      },
    ];
    return res.send(toDos);
  } else return res.status(400).json({ error: "note already exists" });
});

app.delete("/todos/:id", (req, res) => {
  toDos = toDos.filter((todo) => todo.id != req.params.id);
  res.send(toDos);
});

app.put("/todos/:id", (req, res) => {
  toDos = toDos.map((todo) =>
    todo.id == req.params.id ? { ...todo, completed: !todo.completed } : todo
  );
  res.send(toDos);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
