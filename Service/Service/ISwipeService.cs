using RunBuddies.DTOs.Swipes;

namespace RunBuddies.Service;

public interface ISwipeService
{
    Task<SwipeResponse> RecordSwipe(Guid swiperId, SwipeRequest request);
}
