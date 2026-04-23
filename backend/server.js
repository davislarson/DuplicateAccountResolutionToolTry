require("dotenv").config();
const parseBody = require("./parseBody");

// Require necessary modules
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const okta = require("@okta/okta-sdk-nodejs");

const app = express();
const port = process.env.PORT || 3001;

// function checkApiKey(req, res, next) {
// 	const apiKey = req.headers["x-api-key"];
// 	if (!apiKey || apiKey !== process.env.API_KEY) {
// 		return res.status(403).json({ error: "Forbidden: Invalid or missing API key" });
// 	}
// };

// Configure Okta clients for CES and institutions
// const oktaClients = configureClients();

// if (!oktaClients) {
// 	console.error("Failed to configure Okta clients. Exiting...");
// 	process.exit(1);
// }

app.use(cors());
app.use(parseBody);

app.get("/", (req, res) => {
	res.send("Hello from the backend!");
});

app.post("/ccc/fromUuid", (req, res) => {
	console.log("Received request to /ccc/fromUuid");
	console.log(req.body);
	const { uuid } = req.body;

	let data = JSON.stringify({
		cesUUID: uuid,
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": "",
		},
		data: data,
	};

	axios
		.request(config)
		.then((response) => {
			return res.json(response.data);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).json({ error: "Error fetching data from CCC" });
		});
});

app.post("/delete", (req, res) => {
	console.log("Received request to /delete");
	console.log(req.body);
	const { oktaIds } = req.body;
});

//TODO this is not finished, needs error handling and other stuff


app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
