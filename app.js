const express = require("express");
const app = express();
const engine = require("ejs-locals");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const redis = require("redis");
const session = require("express-session");
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient(6379, 'srv-captain--rediscache', { password: 'monty123' });
// const redisClient = redis.createClient();
const path = require("path");

// http://maps.googleapis.com/maps/api/geocode/json?latlng=22.7195687,75.8577258&sensor=ture&key=AIzaSyCRhEYo3gT42bJn73I3f9xMFf451l1zIIc

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

const auth = require('./routes/auth');
const newsFeed = require('./routes/newsFeed');

app.use('/auth', auth);
app.use('/newsFeed', newsFeed)

app.get("/", async (req, res)=>{

	var ip = req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	(req.connection.socket ? req.connection.socket.remoteAddress : null);

	console.log(ip)

	res.render('./index', {title : "Planfrank Login",data : ""})
})

const port = process.env.port || 5000;
app.listen(port, () => {
	console.log(`Running on PORT ${port} `);
});