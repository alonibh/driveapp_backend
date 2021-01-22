require('dotenv').config()

const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require('mongoose')
const app = Express();
const { APIError } = require('./helpers/errors')

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

try {
	// Handle promise here
	mongoose.connect(process.env.MONGO_URL, { 
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});
	console.log("Connected to MongoDB")
} catch (e) {
	throw new Error("Can't connect DB")
}
 
app.listen(process.env.WEB_PORT, () => { console.log("Listening") });

app.get('/', (req, res) => res.send('app'))
app.use('/', require('./routes'))
app.use(async (err, req, res, next) => {
	if (err instanceof APIError && err.isPublic) {
		console.log(`APIError: ${err.message} ${err.params}`)
		res.status(400).send({
			err: err.message,
			params: err.params
		})
	} 
	else {
		if (err instanceof APIError) {
			console.log(`APIError Internal: ${err.message} ${err.params}`)
			console.log(err.stack)
		}
		else {
			console.log(`Unknown Error: ${err.message}`)
			console.log(err.stack)
		}
		res.status(500).send("API internal error")
	}
})

module.exports = {
	app
}