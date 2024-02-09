import express, { response } from "express"; // imports the entire express library from the node modules
const app = express(); // returns an instance of the exprress app
const PORT = process.env.PORT || 3000; //So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.

app.use(express.json());
app.use(express.urlencoded());

const mockUsers = [
  { id:1, username: "aditya", displayName: "Aditya" },
  { id:2, username: "", displayName: "" },
  { id:3, username: "", displayName: "" },
];

// req and res are both paramters of a function, but they are objects by nature

// The req parameter gives you pretty much all the information about the request i.e all the information about the client that is making the request such as cookies and getting the ip address, header, and also request body(which is something that we do in post request) and you can tell whether they are authenticated or not.

// The response object is responsible for sending responses back to the client

app.get("/", function (request, response) {
  response.sendStatus(201).send({ msg: "Hello" });
});

app.get("/api/users", function (request, response) {
  response.send(mockUsers);
});

// Route Parameters

// request.params is an object which shows the route variable as an object and request.params.id will give us the value of the route variable.

app.get("/api/users/:id", (request, response) => {
  console.log(request.params.id);
  // Validation for your incoming get  requests
  const parsedID = parseInt(request.params.id);
  console.log(parsedID);
  if (isNaN(parsedID)) {
    return response.sendStatus(400).send({ msg: "Bad Request. Invalid ID" });
  }

  const findUser = mockUsers.find(user => {
    user.id === parsedID;
  });
  if (!findUser){
    return response.sendStatus(404);
  } 
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 1, product: "Chicken Shwarma", price: 90 }]);
});

// Creating/adding a new resource - POST request and send all that data on a payload or a request body and this request body can be referenced from the request object

app.post("/groceries", (request, response) => {
  // We need to use a middleware function to parse the request
  console.log(request.body);
  jyeyijyeieyiy;
  groceryList.push(request.body);
  response.sendStatus(201);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
