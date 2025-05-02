# Use case - Delete User
| Info | Description |
| --- | --- |
| Name: | Delete User  |
| Actor: | Admin |
| Description: | User wants to delete a user in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "User Overview". <br> 3. System displays a list of users. <br> 4. User selects the option to edit the information of a new user. <br> 5. System displays a form for the user editing.<br> 6. User selects the option to delete the user from the system. <br> 7. System asks the user for confirmation. <br> 8. User confirms his action of deleting the selected user. <br> 9. System informs the user that the selected user account has been successfully deleted.| 
| Result: | The Admin has deleted the selected user. |
| Exceptions: | 8. Users cancels de deletion of the user.  <br> 7.1 Use case goes back to step 5. |
