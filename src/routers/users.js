import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.js";
import { mockUsers } from "../utils/constants.js";
import { resolveUserById } from "../utils/middlewares.js";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage(" Must not be empty ")
    .isLength({ min: 3, max: 10 })
    .withMessage(" Must be atleast 3 - 10 characters "),
  function (request, response) {
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
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

router.get("/api/users/:id", resolveUserById, (request, response) => {
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
})

router.post("/api/users",
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
});

// PUT requests
// The main difference is that a PUT request is used to replace a resource entirely, while a PATCH request is used to partially update a resource.
// We are going to setup a put request to update a user by its id

router.put("/api/users/:id", resolveUserById, (request, response, next) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
});
  
  // A patch request is used when we want to change certain fields only because say a user has 10 different fields then we obviously wpuldn't want to set all the fields everytime right
  
  // app.use(loggingMiddleware); // If I declare the middleware here then the routes before this line will not be able to access the middleare function
  
router.patch("/api/users/:id", resolveUserById, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
});
  
  // Delete request
  
router.delete("/api/users/:id", resolveUserById, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
});
  


export default router;