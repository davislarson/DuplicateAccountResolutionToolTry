function SchoolData(props) {
   return (
      <div className="border p-3 mb-3">
         <h1>{props.school}</h1>
         <hr />
         <table style={{ width: "100%" }}>
            <tbody>
               <tr>
                  <td><strong>First Name:</strong></td>
                  <td>{props.schoolData.firstName}</td>
               </tr>
               <tr>
                  <td><strong>Last Name:</strong></td>
                  <td>{props.schoolData.lastName}</td>
               </tr>
               <tr>
                  <td><strong>Username:</strong></td>
                  <td>{props.schoolData.username}</td>
               </tr>
               <tr>
                  <td><strong>Email:</strong></td>
                  <td>{props.schoolData.email}</td>
               </tr>
               {props.schoolData.instUUID && (
                  <tr>
                     <td><strong>Institution UUID:</strong></td>
                     <td>{props.schoolData.instUUID}</td>
                  </tr>
               )}
               <tr>
                  <td><strong>Okta ID:</strong></td>
                  <td>{props.schoolData.oktaId}</td>
               </tr>
            </tbody>
         </table>
      </div>
   );
}

export default SchoolData;