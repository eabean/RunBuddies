namespace RunBuddies.DTOs.Photos;

public class SavePhotoRequest
{
    public string S3Key { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public short DisplayOrder { get; set; }
}
