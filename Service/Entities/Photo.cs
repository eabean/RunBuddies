namespace RunBuddies.Entities;

public class Photo
{
    public Guid Id { get; set; }
    public Guid ProfileId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public short DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation property
    public Profile Profile { get; set; } = null!;
}
