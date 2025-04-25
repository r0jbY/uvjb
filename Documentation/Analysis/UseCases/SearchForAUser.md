# Use case - Log in
| Info | Description |
| --- | --- |
| Name: | Search for a User |
| Actor: | Admin |
| Description: | User wants to search for a specific user. |
| Pre-condition: | User is logged in on the Admin Dashboard.  |
| Scenario: | 1. User opens the application. <br> 2. System displays "User overview page". <br> 3. System gives the option to search for a user. <br> 4. User adds in the relevant search termsc(first name, last name, address, phone number). <br> 5. System displays a list of all users matching the search criteria.  | 
| Result: | User has succesfully searched for a user. |
| Exceptions: | 5. System can not find any users matching the search criteria. <br> 5.1 System alerts the user that no users matching his search terms could be found. <br> 5.2 Use case goes back to step 4. |

