import SchoolData from "./SchoolData";
import { useEffect, useState } from "react";
import data from "../data/data";
import { fetchTripleCData, fetchCesUUIDFromChurchAccountID } from "../api/dartApi";

function UuidSection({ id, chooseMainAccount, mainAccount, onSearch }) {
	const [uuid, setUuid] = useState("");
	const [searchedUuid, setSearchedUuid] = useState("");
	const [tripleCData, setTripleCData] = useState({});
	const [oktaIds, setOktaIds] = useState({});
	const [error, setError] = useState(null);
	const [filledData, setFilledData] = useState([]);
	const [emptyData, setEmptyData] = useState([]);
	const [errorData, setErrorData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchOnUUID, setSearchOnUUID] = useState(true);
	const [churchAccountID, setChurchAccountID] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		let fetchedUuid = uuid;
		if (!searchOnUUID) {
			console.log("Searching on Church Account ID");
			fetchedUuid = await fetchCesUUIDFromChurchAccountID(churchAccountID);
			setUuid(fetchedUuid);	
			console.log("Fetched UUID:", fetchedUuid);
		}
		if (fetchedUuid) {
			setSearchedUuid(fetchedUuid);
			onSearch(id, fetchedUuid);
			setUuid("");
			setChurchAccountID("");
			await fetchData(fetchedUuid);
			setIsLoading(false);
			setError(null);
		} else {
			console.error("UUID is required");
			setError("UUID is required");
			setIsLoading(false);
		}
	}

	async function handleUuidChange(event) {
		setUuid(event.target.value);
	}

	async function handleChurchAccountIDChange(event) {
		setChurchAccountID(event.target.value);
	}

	async function fetchData(uuid) {
		// NOTE: This is where you would normally fetch data from the backend
		// For example:
		try {
			const data = await fetchTripleCData(uuid);
			console.log(data);
			if (data) {
				setTripleCData(data);
				sortCCCData(data);
				setError(null);
			}
		} catch (error) {
			console.error("Error fetching data", error);
			setError("Error fetching data");
		}
		// NOTE: Uncomment the following lines to use the static data from data.js
		// // For now, we will use the data from data.js
		// const response = data;
		// if (response) {
		// 	setTripleCData(response);
		// 	sortCCCData(response);
		// 	setError(null);
		// } else {
		// 	console.error("Error fetching data");
		// 	setError("Error fetching data");
		// }
	}

	async function deleteAccount({ uuid }) {
		let userConfirmed = confirm("Are you sure? This will delete the account and cannot be undone.");
		if (!userConfirmed) {
			console.log("User cancelled account deletion.");
		} else {
			console.log("User confirmed account deletion for UUID:", uuid);
		}
	}

	// Due to the format of the return data, this function sorts the data into filled, empty, and error arrays
	// to allow for easy rendering in the UI.
	function sortCCCData(data) {
		const filled = [];
		const empty = [];
		const error = [];

		Object.entries(data).forEach(([key, value]) => {
			if (key === "cesUUID") {
				return;
			}
			if (value === false) {
				empty.push(key);
			} else if (typeof value === "object") {
				filled.push(key);
			} else {
				error.push(key);
			}
		});

		setFilledData(filled);
		setEmptyData(empty);
		setErrorData(error);
	}

	// If deleting an account, we need to okta ID for all the schools that have accounts
	useEffect(() => {
		if (!filledData.length || Object.keys(tripleCData).length === 0) return;

		// This code runs if the API call returned data and state values are set
		const ids = {};
		filledData.forEach((school) => {
			ids[school] = tripleCData[school].oktaId;
		});
		console.log("Okta IDs to delete:", ids);
		setOktaIds(ids);
	}, [tripleCData, filledData]);

	// Conditional style based on mainAccount
	const containerStyle =
		mainAccount && mainAccount.uuid === searchedUuid ? { border: "2px solid green" } : { border: "2px dashed white" };

	return (
		<>
			<div className="uuid-section" style={containerStyle}>
				<div className="search-bar">
					<form onSubmit={handleSubmit} className="form-inline">
						{searchOnUUID ? (
							<label className="form-label">
								Search on CES UUID:
								<input
									type="text"
									name="uuid"
									className="uuid-input"
									value={uuid}
									onChange={handleUuidChange}
								/>
							</label>
						) : (
							<label className="form-label">
								Search on Church Account ID:
								<input
									type="text"
									name="churchAccountID"
									className="uuid-input"
									value={churchAccountID}
									onChange={handleChurchAccountIDChange}
								/>
							</label>
						)}
						<button type="submit" className="sendButton">
							Send
						</button>
					</form>
					<br />
					<button onClick={() => setSearchOnUUID(!searchOnUUID)} className="sendButton">
						{searchOnUUID ? "Switch to Church Account ID" : "Switch to CES UUID"}
					</button>
				</div>
				<div className="row">
					{searchedUuid && (
						<div>
							<h3>
								cesUUID:
								<span
									style={{
										fontWeight: "normal",
										fontSize: "1.4rem",
										marginLeft: "0.5rem",
									}}
								>
									{searchedUuid}
								</span>
							</h3>
						</div>
					)}
					{isLoading ? (
						<div className="col">
							<div className="d-flex flex-column justify-content-center align-items-center">
								<h2>Loading...</h2>
							</div>
						</div>
					) : (
						<>
							{/* This is the section for environments with an account */}
							{filledData.length > 0 && (
								<>
									<h1>Found Accounts</h1>
									<div className="container">
										<div className="row">
											{error ? (
												<div className="col-12">
													<div className="border d-flex flex-column justify-content-center align-items-center">
														<h2>Error</h2>
														<p>{error}</p>
													</div>
												</div>
											) : (
												filledData.map((key) => (
													<div className="col-12" key={key}>
														<SchoolData schoolData={tripleCData[key]} school={key} />
													</div>
												))
											)}
										</div>
									</div>
								</>
							)}
							{/* This is the section for environments with no accounts */}
							{emptyData.length > 0 && !error && (
								<>
									<h3>No Account Found</h3>
									<ul>
										{emptyData.map((key) => (
											<li key={key}>{key}</li>
										))}
									</ul>
								</>
							)}

							{/* This is the section for environments with an error */}
							{errorData.length > 0 && !error && (
								<>
									<h3>Error Calling Okta</h3>
									<ul>
										{errorData.map((key) => (
											<li key={key}>{key}</li>
										))}
									</ul>
								</>
							)}
						</>
					)}
				</div>
				{/* These are the action buttons */}
				{filledData.length > 0 && !error && (
					<>
						<div className="actionButtons">
							<button className="sendButton" onClick={() => chooseMainAccount({ uuid: searchedUuid })}>
								Keep this cesUUID
							</button>
							<button className="deleteButton" onClick={() => deleteAccount({ oktaIds })}>
								Delete this account
							</button>
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default UuidSection;
