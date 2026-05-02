namespace RunBuddies.DTOs.Swipes;

public class SwipeRequest
{
    public Guid SwipedUserId { get; set; }
    public bool IsLike { get; set; }
}
