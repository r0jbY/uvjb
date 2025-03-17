package digitaalmaatjes.digitaalmaatjes.family;

import digitaalmaatjes.digitaalmaatjes.client.Client;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "family")
public class Family {

    @Id
    @GeneratedValue
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    private String phoneNumber;

    @NotNull
    private String relation;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
