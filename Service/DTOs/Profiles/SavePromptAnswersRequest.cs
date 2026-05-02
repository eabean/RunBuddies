namespace RunBuddies.DTOs.Profiles;

public class SavePromptAnswersRequest
{
    public List<PromptAnswerItem> Answers { get; set; } = new List<PromptAnswerItem>();
}

public class PromptAnswerItem
{
    public Guid PromptId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
}
