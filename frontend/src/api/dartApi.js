/*
This file is to store all the backend API calls.

*/

const backendUrl = "http://localhost:3001";

export async function fetchTripleCData(uuid) {
	const response = await fetch(`${backendUrl}/ccc/fromUuid`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ uuid: uuid }),
	});
	const data = await response.json();
	return data;
}

export async function mergeAccounts(searches, mainAccount) {
   const { first, second } = searches;
	// TODO This was ai generated automatically, haven't looked at it, it is wrong...   
	fetch("http://localhost:3001/ccc/merge", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			mainAccount,
			first,
			second,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Merge response:", data);
		})
		.catch((error) => {
			console.error("Error merging accounts:", error);
		});

}
