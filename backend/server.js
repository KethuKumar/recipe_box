import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const PORT = config.PORT || 8000

connectDB()

app.listen(PORT,()=>{
    console.log(`server running on port http://localhost:${PORT}`)
})