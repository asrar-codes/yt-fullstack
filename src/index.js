import dontev from "dotenv";

import connectDb from "./db/connect.js";
import { app } from "./app.js";

dontev.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;
connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(error);
    });
    app.listen(port, () => console.log(`Server is running at port: ${port}`));
  })
  .catch((err) => console.log("Mongodb connection failed ..!!", err));

/*
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("on error", error);
      throw new Error(error);
    });
    app.listen(process.env.PORT, () => {
      console.log(`server started on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("catch", error);
  }
})();

*/
