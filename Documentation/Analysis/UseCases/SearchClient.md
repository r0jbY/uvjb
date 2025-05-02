# Use case - Search for a client
| Info | Description |
| --- | --- |
| Name: | Search for a Client |
| Actor: | Admin |
| Description: | User wants to search for a specific client. |
| Pre-condition: | User is logged in on the Admin Dashboard.  |
| Scenario: | 1. User opens the application. <br> 2. User goes to "Client overview page". <br> 3. System gives the option to search for a client. <br> 4. User adds in the relevant search termsc(first name, last name, address, phone number). <br> 5. System displays a list of all clients matching the search criteria.  | 
| Result: | User has succesfully searched for a client. |
| Exceptions: | 5. System can not find any clients matching the search criteria. <br> 5.1 System alerts the user that no clients matching his search terms could be found. <br> 5.2 Use case goes back to step 4. |

