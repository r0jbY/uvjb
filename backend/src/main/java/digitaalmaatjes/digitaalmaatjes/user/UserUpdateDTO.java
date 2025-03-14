package digitaalmaatjes.digitaalmaatjes.user;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String adress;
    private String phonenumber;
    private boolean active;
    private String role; // Use a string here to make the role editable, then convert to an enum.
}
