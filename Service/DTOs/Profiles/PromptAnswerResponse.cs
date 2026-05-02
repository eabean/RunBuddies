namespace RunBuddies.DTOs.Profiles;

public class PromptAnswerResponse
{
    public Guid PromptId { get; set; }
    public string PromptText { get; set; } = string.Empty;
    public string AnswerText { get; set; } = string.Empty;
}
