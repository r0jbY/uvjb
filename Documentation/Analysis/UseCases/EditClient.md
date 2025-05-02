# Use case - Edit Client
| Info | Description |
| --- | --- |
| Name: | Edit Client  |
| Actor: | Admin |
| Description: | User wants to edit the information of a client in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "Client Overview". <br> 3. System displays a list of users. <br> 4. User selects the option to edit the information of a specific client.. <br> 5. System displays a form for the client information editing.<br> 6. User fills in the necessary information (First Name, Last Name, Phone Number, Address, Device code, Superbuddy, Status(active/inactive). <br> 7. System checks the validity of the information. <br> 8. System informs the user that the information of the client has been successfully edited.| 
| Result: | The Admin has edited the information of a client. |
| Exceptions: | 7. System determines that one of the fields is not valid. <br> 7.1 System alerts the user to re-enter the invalid fields. <br> 7.2 Use case goes back to step 6. |
