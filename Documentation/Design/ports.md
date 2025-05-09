# Internal Port Allocation

| Service | Container Port |
|---------|----------------|
| APIGateway | 8080 |
| AuthenticationService | 3000 |
| UserService | 3001 |
| ClientService | 3002 |
| ClientNetworkService | 3003 |


> **Note**  
> These are the *in‑container* ports each service listens on.  
> If you ever change a port (or add a new service), update this table in the same commit to prevent clashes.
