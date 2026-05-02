using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RunBuddies.Data;
using RunBuddies.DTOs.Photos;
using RunBuddies.DTOs.Profiles;
using RunBuddies.Entities;
using RunBuddies.Infrastructure;

namespace RunBuddies.Service;

public class PhotoService(RunBuddiesDbContext db, IAmazonS3 s3Client, IOptions<S3Settings> s3Options) : IPhotoService
{
    private readonly S3Settings _s3 = s3Options.Value;

    public async Task<PhotoUploadUrlResponse> GetUploadUrl(Guid userId, PhotoUploadUrlRequest request)
    {
        var s3Key = $"profiles/{userId}/{Guid.NewGuid()}_{request.FileName}";

        var presignRequest = new GetPreSignedUrlRequest
        {
            BucketName = _s3.BucketName,
            Key = s3Key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(5),
            ContentType = request.ContentType
        };

        var uploadUrl = await s3Client.GetPreSignedURLAsync(presignRequest);

        return new PhotoUploadUrlResponse
        {
            UploadUrl = uploadUrl,
            S3Key = s3Key
        };
    }

    public async Task<PhotoResponse> SavePhoto(Guid userId, SavePhotoRequest request)
    {
        var profile = await db.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Profile not found.");

        if (request.IsMain)
        {
            await db.Photos
                .Where(ph => ph.ProfileId == profile.Id && ph.IsMain)
                .ExecuteUpdateAsync(s => s.SetProperty(ph => ph.IsMain, false));
        }

        var photo = new Photo
        {
            ProfileId = profile.Id,
            FilePath = request.S3Key,
            IsMain = request.IsMain,
            DisplayOrder = request.DisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        db.Photos.Add(photo);
        await db.SaveChangesAsync();

        return new PhotoResponse
        {
            Id = photo.Id,
            Url = $"https://{_s3.BucketName}.s3.{_s3.Region}.amazonaws.com/{photo.FilePath}",
            IsMain = photo.IsMain,
            DisplayOrder = photo.DisplayOrder
        };
    }

    public async Task DeletePhoto(Guid userId, Guid photoId)
    {
        var photo = await db.Photos
            .Include(ph => ph.Profile)
            .FirstOrDefaultAsync(ph => ph.Id == photoId)
            ?? throw new KeyNotFoundException("Photo not found.");

        if (photo.Profile.UserId != userId)
            throw new KeyNotFoundException("Photo not found.");

        await s3Client.DeleteObjectAsync(_s3.BucketName, photo.FilePath);

        db.Photos.Remove(photo);
        await db.SaveChangesAsync();
    }
}
