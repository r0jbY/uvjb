package digitaalmaatjes.digitaalmaatjes.userClient;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClientUserResponse {
    private Integer clientId;
    private List<Integer> assignedUserIds;
}
