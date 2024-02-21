import express, { request, response } from "express"; 
import routes from "./routers/index.js"

const app = express(); 

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(routes);

app.get("/", (request, response, next) => {
  console.log(`Base URl 1`);
  next();
  return response.sendStatus(201).json({ msg: "Hello" });
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));