namespace RunBuddies.Entities;

public class PromptAnswer
{
    public Guid Id { get; set; }
    public Guid ProfileId { get; set; }
    public Guid PromptId { get; set; }
    public string AnswerText { get; set; } = string.Empty;

    // Navigation properties
    public Profile Profile { get; set; } = null!;
    public Prompt Prompt { get; set; } = null!;
}
