import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
    response.send([{ id: 1, product: "Chicken Shwarma", price: 90 }]);
  });

export default router;