namespace RunBuddies.DTOs.Profiles;

public class PhotoResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public short DisplayOrder { get; set; }
}
