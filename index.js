import express from "express"


// express
const app = express()
app.use(express.static("public"))
app.listen(process.env.PORT || 5000,()=> console.log("Server is running"))