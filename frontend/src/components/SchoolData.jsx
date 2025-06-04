function SchoolData(props) {

   return (
      <>
         <div className="border d-flex flex-column justify-content-center align-items-left p-3 mb-3">
         <h1>{ props.school}</h1>
         <hr />
			<p><strong>First Name:</strong> { props.schoolData.firstName }</p>
			<p><strong>Last Name:</strong> { props.schoolData.lastName }</p>
			<p><strong>Username:</strong> { props.schoolData.username }</p>
			<p><strong>Email:</strong> { props.schoolData.email }</p>
			{props.schoolData.instUUID ? <p><strong>Institution UUID:</strong> { props.schoolData.instUUID }</p> : ""}
			<p><strong>Okta ID:</strong> { props.schoolData.oktaId }</p>
         </div>
      </>
   )
}

export default SchoolData;