/* eslint-disable react/prop-types */
import React from 'react'
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = (props) => {
  return (
    <div id="profile-div">
      <p>
        <strong>Email: </strong> {JSON.stringify(props.graphData)}
      </p>
      <p>
        <strong>First Name: </strong> {props.graphData.givenName}
      </p>
      <p>
        <strong>Last Name: </strong> {props.graphData.surname}
      </p>
      <p>
        <strong>Cargo: </strong> {props.graphData.jobTitle}
      </p>
      <p>
        <strong>Email: </strong> {props.graphData.userPrincipalName}
      </p>
      <p>
        <strong>Id: </strong> {props.graphData.id}
      </p>
    </div>
  )
}
