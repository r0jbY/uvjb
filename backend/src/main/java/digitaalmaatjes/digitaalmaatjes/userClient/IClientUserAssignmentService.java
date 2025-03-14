package digitaalmaatjes.digitaalmaatjes.userClient;

public interface IClientUserAssignmentService {
    boolean assignUserToClient(Integer clientId, Integer userId);
    ClientUserResponse getAssignedUsers(Integer clientId);
    boolean removeUserFromClient(Integer clientId, Integer userId);
}