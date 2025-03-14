package digitaalmaatjes.digitaalmaatjes.meeting;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MeetingDTO {

    private Integer id;
    private Integer clientId;
    private Integer userId;
    private LocalDateTime datetime;
    private String notification;
}
