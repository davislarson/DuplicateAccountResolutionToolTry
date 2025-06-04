const parseBody = require("./parseBody");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(parseBody);

app.get("/", (req, res) => {
	res.send("Hello from the backend!");
});

app.post("/ccc/fromUuid", (req, res) => {
  console.log("Received request to /ccc/fromUuid");
  console.log(req.body);
	const { uuid } = req.body;

	const axios = require("axios");
	let data = JSON.stringify({
		cesUUID: uuid
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

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
