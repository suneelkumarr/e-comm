require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db =  require('./config/Connectdb')

const usersRouter = require('./routes/users.routes');


const AuthMiddleware = require('./Middleware/auth.middleware');
const AppResponseDto = require('./dtos/responses/app_response.dto');
const BenchmarkMiddleware = require('./Middleware/benchmark.middleware');


port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json())
app.use(BenchmarkMiddleware.benchmark);
app.use(AuthMiddleware.loadUser);
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and Resync with { force: true }");
//   });

app.use('/api/users', usersRouter);

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });

app.listen(port,(req, res)=>{
    console.log("server is running on port `${port}`");
    console.log(`http://localhost:${port}`);
})