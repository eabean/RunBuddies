namespace RunBuddies.DTOs.Discovery;

public class DiscoveryProfileResponse
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public int Age { get; set; }
    public int ExperienceLevel { get; set; }
    public decimal PaceMinutes { get; set; }
    public int PaceUnit { get; set; }
    public string? Biography { get; set; }
    public string? LookingFor { get; set; }
    public string? MainPhotoUrl { get; set; }
    public List<DiscoveryPromptAnswer> PromptAnswers { get; set; } = new List<DiscoveryPromptAnswer>();
}

public class DiscoveryPromptAnswer
{
    public string PromptText { get; set; } = string.Empty;
    public string AnswerText { get; set; } = string.Empty;
}
