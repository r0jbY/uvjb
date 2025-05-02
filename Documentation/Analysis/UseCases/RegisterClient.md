# Use case - Register Client
| Info | Description |
| --- | --- |
| Name: | Register Client  |
| Actor: | Admin |
| Description: | User wants to register a new client in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "Client Overview". <br> 3. System displays a list of clients. <br> 4. User selects the option to create a new client. <br> 5. System displays a form for the new client creation.<br> 6. User fills in the necessary information (First Name, Last Name, Phone Number, Address, Device Code, Supperbuddy, Status (Active/Inactive) ). <br> 7. System checks the validity of the information. <br> 8. System informs the user that the new client account has been successfully created.| 
| Result: | The Admin has registered a new client. |
| Exceptions: | 7. System determines that one of the fields is not valid. <br> 7.1 System alerts the user to re-enter the invalid fields. <br> 7.2 Use case goes back to step 6. |
