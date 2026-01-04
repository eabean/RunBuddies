namespace RunBuddies.Entities;

public class Prompt
{
    public Guid Id { get; set; }
    public string PromptText { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation property
    public ICollection<PromptAnswer> PromptAnswers { get; set; } = new List<PromptAnswer>();
}
