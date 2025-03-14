package digitaalmaatjes.digitaalmaatjes.meeting;

import java.util.List;

public interface IMeetingService {
    boolean logMeeting(MeetingDTO meetingDTO);
    List<MeetingDTO> getMeetingsForClient(Integer clientId);
    List<MeetingDTO> getMeetingsForUser(Integer userId);
}
