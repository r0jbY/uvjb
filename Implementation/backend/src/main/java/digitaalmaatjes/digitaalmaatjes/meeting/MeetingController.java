package digitaalmaatjes.digitaalmaatjes.meeting;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/meetings")
public class MeetingController {

    private final IMeetingService service;

    public MeetingController(@Qualifier("MeetingService") IMeetingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> logMeeting(@RequestBody MeetingDTO meetingDTO) {
        boolean logged = service.logMeeting(meetingDTO);
        return logged ? ResponseEntity.ok("Meeting logged successfully!")
                : ResponseEntity.status(400).body("Failed to log the meeting.");
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<MeetingDTO>> getMeetingsForClient(@PathVariable Integer clientId) {
        List<MeetingDTO> meetings = service.getMeetingsForClient(clientId);
        return meetings != null ? ResponseEntity.ok(meetings) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MeetingDTO>> getMeetingsForUser(@PathVariable Integer userId) {
        List<MeetingDTO> meetings = service.getMeetingsForUser(userId);
        return meetings != null ? ResponseEntity.ok(meetings) : ResponseEntity.notFound().build();
    }
}
