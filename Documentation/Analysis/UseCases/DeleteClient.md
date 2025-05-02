# Use case - Delete Client
| Info | Description |
| --- | --- |
| Name: | Delete Client  |
| Actor: | Admin |
| Description: | User wants to delete a client in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "Client Overview". <br> 3. System displays a list of clients. <br> 4. User selects the option to edit the information of a client. <br> 5. System displays a form for the client editing.<br> 6. User selects the option to delete the client from the system. <br> 7. System asks the user for confirmation. <br> 8. User confirms his action of deleting the selected client. <br> 9. System informs the user that the selected client has been successfully deleted.| 
| Result: | The Admin has deleted the selected client. |
| Exceptions: | 8. Users cancels de deletion of the client.  <br> 7.1 Use case goes back to step 5. |
