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
		url: "https://ccc.dev.ceslogin.org/ccc",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": "LWNl4udMyc53izwM1dmOQ8pK6X0HSg2kl8AT4TR2",
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

app.post("/fromChurchAccountID", async (req, res) => {
	const { churchAccountID } = req.body;
	try {
		let CESOktaClient = new okta.Client({
			orgUrl: "https://" + process.env.CES_OKTA_URL,
			token: process.env.CES_OKTA_API_TOKEN
		});

		let collection = await CESOktaClient.userApi.listUsers({
			search: `profile.churchAccountID eq "${churchAccountID}"`,
		});
		await collection.each((user) => {
			if (user.profile.cesUUID) {
				return res.json({ cesUUID: user.profile.cesUUID });
			}
		});
	} catch (error) {
		console.error("Error fetching CES UUID from Church Account ID:", error);
		return res.status(500).json({ error: "Error fetching CES UUID" });
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
