const express = require("express");
const app = express();
const engine = require("ejs-locals");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();
const path = require("path");

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

const auth = require('./routes/auth')
app.use('/auth', auth);

app.get("/", async (req, res)=>{
	res.render('./index', {title : "Planfrank Login"})
})

app.get("/newsFeed", async (req, res)=>{
	res.render('./newsFeed', {title : "planFrank"})
})

const port = process.env.port || 5000;
app.listen(port, () => {
	console.log(`Running on PORT ${port} `);
});