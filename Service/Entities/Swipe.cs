namespace RunBuddies.Entities;

public class Swipe
{
    public Guid Id { get; set; }
    public Guid SwiperId { get; set; }
    public Guid SwipedUserId { get; set; }
    public bool IsLike { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User Swiper { get; set; } = null!;
    public User SwipedUser { get; set; } = null!;
}
