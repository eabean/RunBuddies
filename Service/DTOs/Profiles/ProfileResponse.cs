namespace RunBuddies.DTOs.Profiles;

public class ProfileResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string ZipCode { get; set; } = string.Empty;
    public decimal PaceMinutes { get; set; }
    public int PaceUnit { get; set; }
    public int MatchingRadiusKm { get; set; }
    public int ExperienceLevel { get; set; }
    public string? Goals { get; set; }
    public string? Biography { get; set; }
    public string? LookingFor { get; set; }
    public string? ContactInfo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<PhotoResponse> Photos { get; set; } = new List<PhotoResponse>();
    public List<PromptAnswerResponse> PromptAnswers { get; set; } = new List<PromptAnswerResponse>();
}
