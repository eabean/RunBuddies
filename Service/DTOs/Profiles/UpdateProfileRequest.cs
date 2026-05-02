namespace RunBuddies.DTOs.Profiles;

public class UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? ZipCode { get; set; }
    public decimal? PaceMinutes { get; set; }
    public int? PaceUnit { get; set; }
    public int? MatchingRadiusKm { get; set; }
    public int? ExperienceLevel { get; set; }
    public string? Goals { get; set; }
    public string? Biography { get; set; }
    public string? LookingFor { get; set; }
    public string? ContactInfo { get; set; }
}
