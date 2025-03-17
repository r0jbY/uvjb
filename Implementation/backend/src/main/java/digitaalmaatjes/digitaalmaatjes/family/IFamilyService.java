package digitaalmaatjes.digitaalmaatjes.family;

import java.util.List;

public interface IFamilyService {
    boolean addFamilyContact(FamilyDTO familyDTO);
    List<FamilyDTO> getFamilyContacts(Integer clientId);
    boolean deleteFamilyContact(Integer id);
}
