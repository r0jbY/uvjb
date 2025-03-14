package digitaalmaatjes.digitaalmaatjes.userClient;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AssignUserToClientRequest {
    private Integer clientId;
    private Integer userId;
}
