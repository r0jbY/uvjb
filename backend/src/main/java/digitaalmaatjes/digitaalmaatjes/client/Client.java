package digitaalmaatjes.digitaalmaatjes.client;

import digitaalmaatjes.digitaalmaatjes.family.Family;
import digitaalmaatjes.digitaalmaatjes.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "client")
public class Client {
    @Id
    @GeneratedValue
    private Integer id;
    @NotNull
    private String firstname;
    @NotNull
    private String lastname;
    @NotNull
    private String adress;
    @NotNull
    private UUID devicecode;
    @NotNull
    private boolean active;

    @ManyToMany
    @JoinTable(
            name = "client_user_assignment",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Family> familyContacts;

    public Client(String firstname, String lastname, String adress, UUID devicecode, boolean active) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.adress = adress;
        this.devicecode = devicecode;
        this.active = active;
    }

    public Set<User> getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<User> assignedUsers) {
        this.assignedUsers = assignedUsers;
    }
}
