using RunBuddies.DTOs.Profiles;

namespace RunBuddies.Service;

public interface IProfileService
{
    Task<ProfileResponse> CreateProfile(Guid userId, CreateProfileRequest request);
    Task<ProfileResponse> GetProfile(Guid userId);
    Task<ProfileResponse> UpdateProfile(Guid userId, UpdateProfileRequest request);
}
