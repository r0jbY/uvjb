package digitaalmaatjes.digitaalmaatjes.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private String firstname;
    private String lastname;
    private String adress;
    private UUID devicecode;
    private boolean active;
}
