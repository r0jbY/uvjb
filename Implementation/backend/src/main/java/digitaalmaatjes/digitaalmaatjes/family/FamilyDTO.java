package digitaalmaatjes.digitaalmaatjes.family;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FamilyDTO {
    private Integer id;
    private String name;
    private String phoneNumber;
    private String relation;
    private Integer clientId;
}
