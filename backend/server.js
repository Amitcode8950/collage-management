import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";

connectDB()

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});