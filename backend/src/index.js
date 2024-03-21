import express from "express";
import { db } from "./db/index.js";
import redis from "redis";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const port = 5050;

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function cacheMiddleware(req, res, next) {
  const page = parseInt(req.query.page) || 1; // Get page number from query string
  const cacheKey = page;
  console.log(cacheKey);
  try {
    const data = await redisClient.get(JSON.stringify(cacheKey));
    if (data) {
      console.log("cached!!");
      return res.json(JSON.parse(data));
    }
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
}

app.get("/all", cacheMiddleware, async (req, res) => {
  const { page, limit } = req.query;
  console.log(page, limit);
  const offset = (page - 1) * limit;

  const q = "SELECT * FROM code limit ? offset ?";

  db.query(q, [+limit, +offset], async (err, data) => {
    if (err) {
      return res.json({
        message: err.message,
      });
    }
    try {
      const serializedData = JSON.stringify(data); // Stringify data once
      await redisClient.set(page, serializedData);
      console.log("Data cached successfully!");
    } catch (error) {
      console.error("Error caching data:", error);
    }
    res.json(data);
  });
});

app.post("/insert", (req, res) => {
  const q =
    "INSERT INTO code(`username`, `code_language`,`stdin`,`source_code`,`timestamp`) VALUES (?,CURRENT_TIMESTAMP)";

  const values = [
    req.body.username,
    req.body.code_language,
    req.body.stdin,
    req.body.source_code,
  ];

  db.query(q, [values], async (err, data) => {
    if (err) {
      return res.json({
        message: err.message,
      });
    }
    console.log(data);
    const id = data.insertId;
    const page = Math.floor((id - 1) / 5) + 1;
    console.log(page);
    try {
      await redisClient.del(JSON.stringify(page));
    } catch (error) {
      console.log("Error in deleting cache key: ", error);
    }
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
