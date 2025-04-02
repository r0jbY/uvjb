# Use case - Log in
| Info | Description |
| --- | --- |
| Name: | Log in - Mobile Application  |
| Actor: | Admin & Buddy  |
| Description: | User wants to log into his account on the mobile application. |
| Pre-condition: | User already has an account.  |
| Scenario: | 1. User opens the application. <br> 2. System displays "Log in" fields (email and password). <br> 3. User fills in the required information and tries to log into his account <br> 4. System checks the validity of the input and logs the user in. <br> 5. System displays a confirmation to the user.  | 
| Result: | User logs into his account |
| Exceptions: | 4. System determines that one of the fields is not valid (email / password). <br> 4.1 System alerts the user to re-enter his credentials. <br> 4.2 Use case goes back to step 2. |

| Info | Description |
| --- | --- |
| Name: | Log in - Web Application  |
| Actor: | Admin  |
| Description: | User wants to log into his account on the Web Application.  |
| Pre-condition: | User already has an account.  |
| Scenario: | 1. User selects the option to log into his account. <br> 2. System displays "Log in" fields (email and password). <br> 3. User fills in the required information and tries to log into his account <br> 4. System checks the validity of the input and logs the user in. <br> 5. System displays a confirmation to the user.  | 
| Result: | User logs into his account |
| Exceptions: |Exception 1: <br> 4. System determines that one of the fields is not valid (email / password). <br> 4.1 System alerts the user to re-enter his credentials. <br> 4.2 Use case goes back to step 2. <br> Exception 2: <br> 4. System determines that user is not an admin. <br> 4.1 System alerts the user that the log in failed. <br> 4.2 Use case goes back to step 2.|
