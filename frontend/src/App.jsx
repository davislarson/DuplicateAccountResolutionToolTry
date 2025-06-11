import UuidSection from "./components/UuidSection";
import { useState } from "react";
import { mergeAccounts } from "./api/dartApi"; // Import the merge function

function App() {
	const [mainAccount, setMainAccount] = useState(null);
	const [searches, setSearches] = useState({ first: "", second: "" });

	function handleChoice(choice) {
		setMainAccount(choice);
		// TODO there may be other things to do here
	}

	function handleSearch(id, searchedUuid) {
		setSearches((prev) => ({ ...prev, [id]: searchedUuid }));
	}

	// async function handleMerge() {
	// 	let userConfirmed = confirm("Are you sure? This will delete the account not chosen. This cannot be undone.");
	// 	if (!userConfirmed) {
	// 		console.log("Delete cancelled by user.");
	// 		return;
	// 	} else {
	// 		console.log("Delete confirmed by user.");
	// 		if (mainAccount) {
	// 			const response = await mergeAccounts(searches, mainAccount);

	// 		} else {
	// 			console.error("Main account is not selected");
	// 		}
	// 	}
	// }

	return (
		<>
			<div className="App">
				<div className="page">
					<UuidSection
						id="first"
						chooseMainAccount={handleChoice}
						onSearch={handleSearch}
						mainAccount={mainAccount}
					/>
					<UuidSection
						id="second"
						chooseMainAccount={handleChoice}
						onSearch={handleSearch}
						mainAccount={mainAccount}
					/>
				</div>
				{/* <button onClick={handleMerge} className="sendButton">Done</button> */}
			</div>
		</>
	);
}

export default App;
