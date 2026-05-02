namespace RunBuddies.DTOs.Profiles;

public class CreateProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string ZipCode { get; set; } = string.Empty;
    public decimal PaceMinutes { get; set; }
    public int PaceUnit { get; set; }
    public int MatchingRadiusKm { get; set; } = 25;
    public int ExperienceLevel { get; set; }
    public string? Goals { get; set; }
    public string? Biography { get; set; }
    public string? LookingFor { get; set; }
    public string? ContactInfo { get; set; }
}
