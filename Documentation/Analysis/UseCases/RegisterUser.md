# Use case - Register User
| Info | Description |
| --- | --- |
| Name: | Register User  |
| Actor: | Admin |
| Description: | User wants to register a new user in the Admin Dashboard. |
| Pre-condition: | User is already logged in. |
| Scenario: | 1. User opens the application. <br> 2. User goes to the "User Overview". <br> 3. System displays a list of users. <br> 4. User selects the option to create a new user. <br> 5. System displays a form for the new user creation.<br> 6. User fills in the necessary information (First Name, Last Name, Phone Number, Email, Password, Role). <br> 7. System checks the validity of the information. <br> 8. System informs the user that the new user account has been successfully created.| 
| Result: | The Admin has registered a new user. |
| Exceptions: | 7. System determines that one of the fields is not valid. <br> 7.1 System alerts the user to re-enter the invalid fields. <br> 7.2 Use case goes back to step 6. |

