namespace RunBuddies.Entities;

public class Message
{
    public Guid Id { get; set; }
    public Guid MatchId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }

    // Navigation properties
    public Match Match { get; set; } = null!;
    public User Sender { get; set; } = null!;
}
