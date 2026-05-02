using RunBuddies.DTOs.Photos;
using RunBuddies.DTOs.Profiles;

namespace RunBuddies.Service;

public interface IPhotoService
{
    Task<PhotoUploadUrlResponse> GetUploadUrl(Guid userId, PhotoUploadUrlRequest request);
    Task<PhotoResponse> SavePhoto(Guid userId, SavePhotoRequest request);
    Task DeletePhoto(Guid userId, Guid photoId);
}
