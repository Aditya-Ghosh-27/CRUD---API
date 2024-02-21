import express, { request, response } from "express"; // imports the entire express library from the node modules
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from './utils/validationSchemas.js';
// The validationResult function in express-validator is used to extract the validation errors from a request and make them available in a Result object. This function takes a request object as its argument and returns a Result object. The Result object contains an array of ValidationError objects, which represent the validation errors that occurred during the request.
// body is used to validate request body
const app = express(); // returns an instance of the exprress app

const PORT = process.env.PORT || 3000; //So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.

app.use(express.json());
app.use(express.urlencoded());

// Example of a middleware function
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

const resolveUserById = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

// Registering a middleware function globally so that everytime I hit a specific route, the middleware gets called immidiately
app.use(loggingMiddleware);

const mockUsers = [
  { id: 1, username: "aditya", displayName: "Aditya" },
  { id: 2, username: "anindo", displayName: "Anindo" },
  { id: 3, username: "firu", displayName: "Firdous" },
  { id: 4, username: "mohok", displayName: "Mohok" },
  { id: 5, username: "suvo", displayName: "Suvodeep" },
  { id: 6, username: "priyo", displayName: "Priyonjeet" },
];

// req and res are both paramters of a function, but they are objects by nature

// The req parameter gives you pretty much all the information about the request i.e all the information about the client that is making the request such as cookies and getting the ip address, header, and also request body(which is something that we do in post request) and you can tell whether they are authenticated or not.

// The response object is responsible for sending responses back to the client

// Registering a middleware function locally
// app.get("/", loggingMiddleware, (request, response) => {
//   response.sendStatus(201).json({ msg: "Hello" });
// });

// This is used when lets say the input request is missing the authorization token then you don't wanna continue to the next middleware.
app.get("/", (request, response, next) => {
  console.log(`Base URl 1`);
  next();
  // },(request, response, next) => {
  //   console.log(`Base URl 2`);
  //   next();
  // },(request, response, next) => {
  //   console.log(`Base URL 3`);
  //   next();
  // }, (request, response) => {
  return response.sendStatus(201).json({ msg: "Hello" });
});

// Query Parameters -> Query parameters are key-value pairs that are attached to the end of a URL to provide additional information to a web server. They appear to the right of the question mark in a URL, starting with ? behind the usual web address.

// Learnt how to deal with query parameters
// I can use this validation chain to keep on calling more methods which in turn will return an instance of the validation.
// query(filter) will make that it is a string and is also not empty
app.get(
  // Validating query parameters thorugh query function
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage(" Must not be empty ")
    .isLength({ min: 3, max: 10 })
    .withMessage(" Must be atleast 3 - 10 characters "),
  (request, response, next) => {
    //Another way of declaring a middleware function
    console.log("Base URL");
    // If we don't write the next() function then the request will hung up and not move onto the next middleware function
    next();
  },
  function (request, response) {
    // console.log(request['express-validator#contexts']);
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request; // since request is an object
    // when filter and value are undefined
    if (!filter && !value) {
      return response.send(mockUsers);
    }
    if (filter && value) {
      return response.send(
        mockUsers.filter((user) => user.username.includes(value))
      );
    }
    return response.send(mockUsers);
  }
);

app.use(loggingMiddleware, function (request, response, next) {
  console.log("Finished logging...");
  next();
});

// Route Parameters

// request.params is an object which shows the route variable as an object and request.params.id will give us the value of the route variable.

app.get("/api/users/:id", (request, response) => {
  // Validation for your incoming GET requests
  const parsedId = parseInt(request.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return response.sendStatus(400).send({ msg: "Bad Request. Invalid ID " });
  }
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) {
    return response.sendStatus(404);
  }
  return response.send(findUser);
  // return response.send(mockUsers[parsedId - 1]);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 1, product: "Chicken Shwarma", price: 90 }]);
});

// Creating/adding a new resource - POST request and send all that data on a payload or a request body and this request body can be referenced from the request object

app.post(
  // we can use a schema to make it look more readable 
  // A schema is basically an object that has all your validator defined
  "/api/users",
  checkSchema(createUserValidationSchema), 
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if(!result.isEmpty()){
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    // We need a middleware function to parse the incoming the request
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.send(mockUsers);
  }
);

// PUT requests
// The main difference is that a PUT request is used to replace a resource entirely, while a PATCH request is used to partially update a resource.
// We are going to setup a put request to update a user by its id

app.put("/api/users/:id", resolveUserById, (request, response, next) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// A patch request is used when we want to change certain fields only because say a user has 10 different fields then we obviously wpuldn't want to set all the fields everytime right

// app.use(loggingMiddleware); // If I declare the middleware here then the routes before this line will not be able to access the middleare function

app.patch("/api/users/:id", resolveUserById, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// Delete request

app.delete("/api/users/:id", resolveUserById, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

// const {
//   body,
//   params: { id },
// } = request;
// const parsedId = parseInt(id);
// if (isNaN(parsedId)) return response.sendStatus(400);
// const findUserIndex = mockUsers.findIndex((user) => {
//   user.id === parsedId;
// });

// if (findUserIndex === -1) return response.sendStatus(404);
