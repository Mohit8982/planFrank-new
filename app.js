const express = require("express");
const app = express();
const engine = require("ejs-locals");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
// let redisClient = redis.createClient(6379, 'srv-captain--redis-cache', { password: 'redisNew' });
let redisClient = redis.createClient();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
	pingTimeout: 60000,
});
// const redis_socket = require('socket.io-redis');
// io.adapter(redis_socket({ host: 'localhost', port: 6379 }));

//Connect To DB
dotenv.config();
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) console.log(err);
		else console.log("Mongo Connected");
	}
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(function (req, res, next) {
	res.set(
		"Cache-Control",
		"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
	);
	next();
});

app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(function(req, res, next) {
    req.io = io;
    next();
});


redisClient.on("error", (err) => {
	console.log(err);
});

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const index = require('./routes/index');
const auth = require('./routes/auth');
const newsFeed = require('./routes/newsFeed');
const individual = require('./routes/individual');

app.use('/', index);
app.use('/auth', auth);
app.use('/newsFeed', newsFeed);
app.use('/plan', individual);

const port = process.env.port || 3000;
server.listen(port, () => {
	console.log(`Running on PORT ${port} `);
});
