using RunBuddies.DTOs.Discovery;

namespace RunBuddies.Service;

public interface IDiscoveryService
{
    Task<List<DiscoveryProfileResponse>> GetProfiles(Guid currentUserId, int page);
}
