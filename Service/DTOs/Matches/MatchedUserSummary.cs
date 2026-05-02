namespace RunBuddies.DTOs.Matches;

public class MatchedUserSummary
{
    public string FirstName { get; set; } = string.Empty;
    public string? ContactInfo { get; set; }
    public string? MainPhotoUrl { get; set; }
    public int ExperienceLevel { get; set; }
    public decimal PaceMinutes { get; set; }
    public int PaceUnit { get; set; }
    public List<MatchPromptAnswer> PromptAnswers { get; set; } = new List<MatchPromptAnswer>();
}

public class MatchPromptAnswer
{
    public string PromptText { get; set; } = string.Empty;
    public string AnswerText { get; set; } = string.Empty;
}
