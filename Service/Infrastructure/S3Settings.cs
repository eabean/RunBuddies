namespace RunBuddies.Infrastructure;

public class S3Settings
{
    public const string SectionName = "AWS";
    public string BucketName { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
}
