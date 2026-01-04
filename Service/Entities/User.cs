namespace RunBuddies.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Profile? Profile { get; set; }
    public ICollection<Swipe> SwipesMade { get; set; } = new List<Swipe>();
    public ICollection<Swipe> SwipesReceived { get; set; } = new List<Swipe>();
    public ICollection<Message> MessagesSent { get; set; } = new List<Message>();
}
