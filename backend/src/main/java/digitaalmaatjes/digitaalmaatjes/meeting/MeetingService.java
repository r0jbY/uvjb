package digitaalmaatjes.digitaalmaatjes.meeting;

import digitaalmaatjes.digitaalmaatjes.client.Client;
import digitaalmaatjes.digitaalmaatjes.client.ClientRepository;
import digitaalmaatjes.digitaalmaatjes.user.User;
import digitaalmaatjes.digitaalmaatjes.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("MeetingService")
public class MeetingService implements IMeetingService {

    private final MeetingRepository meetingRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public MeetingService(MeetingRepository meetingRepository, ClientRepository clientRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean logMeeting(MeetingDTO meetingDTO) {
        Client client = clientRepository.findById(meetingDTO.getClientId()).orElse(null);
        User user = userRepository.findById(meetingDTO.getUserId()).orElse(null);

        if (client == null || user == null) return false;

        Meeting meeting = Meeting.builder()
                .client(client)
                .user(user)
                .datetime(meetingDTO.getDatetime())
                .notification(meetingDTO.getNotification())
                .build();

        meetingRepository.save(meeting);
        return true;
    }

    @Override
    public List<MeetingDTO> getMeetingsForClient(Integer clientId) {
        List<Meeting> meetings = meetingRepository.findByClientId(clientId);

        return meetings.stream()
                .map(meeting -> MeetingDTO.builder()
                        .id(meeting.getId())
                        .clientId(meeting.getClient().getId())
                        .userId(meeting.getUser().getId())
                        .datetime(meeting.getDatetime())
                        .notification(meeting.getNotification())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MeetingDTO> getMeetingsForUser(Integer userId) {
        List<Meeting> meetings = meetingRepository.findByUserId(userId);

        return meetings.stream()
                .map(meeting -> MeetingDTO.builder()
                        .id(meeting.getId())
                        .clientId(meeting.getClient().getId())
                        .userId(meeting.getUser().getId())
                        .datetime(meeting.getDatetime())
                        .notification(meeting.getNotification())
                        .build())
                .collect(Collectors.toList());
    }
}
