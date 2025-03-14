package digitaalmaatjes.digitaalmaatjes.family;

import digitaalmaatjes.digitaalmaatjes.client.Client;
import digitaalmaatjes.digitaalmaatjes.client.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("FamilyService")
public class FamilyService implements IFamilyService {

    private final FamilyRepository familyRepository;
    private final ClientRepository clientRepository;

    public FamilyService(FamilyRepository familyRepository, ClientRepository clientRepository) {
        this.familyRepository = familyRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public boolean addFamilyContact(FamilyDTO familyDTO) {
        Client client = clientRepository.findById(familyDTO.getClientId()).orElse(null);
        if (client == null) return false;

        Family family = new Family();
        family.setName(familyDTO.getName());
        family.setPhoneNumber(familyDTO.getPhoneNumber());
        family.setRelation(familyDTO.getRelation());
        family.setClient(client);

        familyRepository.save(family);
        return true;
    }

    @Override
    public List<FamilyDTO> getFamilyContacts(Integer clientId) {
        Client client = clientRepository.findById(clientId).orElse(null);
        if (client == null) return null;

        return client.getFamilyContacts().stream()
                .map(family -> {
                    FamilyDTO dto = new FamilyDTO();
                    dto.setId(family.getId());
                    dto.setName(family.getName());
                    dto.setPhoneNumber(family.getPhoneNumber());
                    dto.setRelation(family.getRelation());
                    dto.setClientId(clientId);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean deleteFamilyContact(Integer id) {
        if (familyRepository.existsById(id)) {
            familyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
