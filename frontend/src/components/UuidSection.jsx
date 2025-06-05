import SchoolData from "./SchoolData";
import { useState } from "react";
import data from "../data/data";
import { fetchTripleCData } from "../api/dartApi";

function UuidSection({ id, chooseMainAccount, mainAccount, onSearch }) {
	const [uuid, setUuid] = useState("");
	const [searchedUuid, setSearchedUuid] = useState("");
	const [tripleCData, setTripleCData] = useState({});
	const [error, setError] = useState(null);
	const [filledData, setFilledData] = useState([]);
	const [emptyData, setEmptyData] = useState([]);
	const [errorData, setErrorData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		if (uuid) {
			setSearchedUuid(uuid);
			onSearch(id, uuid);
			setUuid("");
			await fetchData(uuid);
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

	async function fetchData(uuid) {
		// NOTE: This is where you would normally fetch data from the backend
		// For example:
		console.log("Fetching data for UUID:", uuid);
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
		// NOTE: Uncomment the following lines to use the data from data.js
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

	// Conditional style based on mainAccount
	const containerStyle =
		mainAccount && mainAccount.uuid === searchedUuid ? { border: "2px solid green" } : { border: "2px dashed white" };

	return (
		<>
			<div className="uuid-section m-2 px-5 py-3" style={containerStyle}>
				<div className="search-bar">

				<form onSubmit={handleSubmit}>
					<label className="form-label">
						Search for CES UUID:
						<input type="text" name="uuid" className="uuid-input" value={uuid} onChange={handleUuidChange} />
					</label>
					<button type="submit" className="sendButton">
						Send
					</button>
				</form>
				</div>
				<div className="row">
					{searchedUuid && (
						<div>
							<h3>
								cesUUID:
								<span
									style={{
										fontWeight: "normal",
										fontSize: "1.5rem",
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
				{filledData.length > 0 && !error && (
					<button className="sendButton" onClick={() => chooseMainAccount({ uuid: searchedUuid })}>
						Keep this cesUUID
					</button>
				)}
			</div>
		</>
	);
}

export default UuidSection;
