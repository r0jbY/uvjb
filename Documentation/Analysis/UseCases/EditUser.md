# Use case - Edit User
| Info | Description |
| --- | --- |
| Name: | Edit User  |
| Actor: | Admin |
| Description: | User wants to edit the information of a user in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "User Overview". <br> 3. System displays a list of users. <br> 4. User selects a user he wants to edit. <br> 5. System displays a form for the user editing.<br> 6. User edits the desired information (First Name, Last Name, Phone Number, Email, Role, Status (Active/Inactive)). <br> 7. System checks the validity of the information. <br> 8. System informs the user that the information of the selected user account has been successfully edited.| 
| Result: | The Admin has edited the information of a user. |
| Exceptions: | 7. System determines that one of the fields is not valid. <br> 7.1 System alerts the user to re-enter the invalid fields. <br> 7.2 Use case goes back to step 6. |
