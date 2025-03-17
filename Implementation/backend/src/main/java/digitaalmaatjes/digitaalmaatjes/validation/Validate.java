package digitaalmaatjes.digitaalmaatjes.validation;

import digitaalmaatjes.digitaalmaatjes.client.ClientDTO;
import org.springframework.stereotype.Service;

@Service("Validate")
public class Validate {
    public boolean client(ClientDTO dto) {
        return true;
    }
}
