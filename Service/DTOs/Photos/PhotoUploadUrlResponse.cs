namespace RunBuddies.DTOs.Photos;

public class PhotoUploadUrlResponse
{
    public string UploadUrl { get; set; } = string.Empty;
    public string S3Key { get; set; } = string.Empty;
}
