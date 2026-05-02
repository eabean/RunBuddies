using Microsoft.EntityFrameworkCore;
using RunBuddies.Data;
using RunBuddies.DTOs.Swipes;
using RunBuddies.Entities;

namespace RunBuddies.Service;

public class SwipeService(RunBuddiesDbContext db) : ISwipeService
{
    public async Task<SwipeResponse> RecordSwipe(Guid swiperId, SwipeRequest request)
    {
        var existing = await db.Swipes
            .FirstOrDefaultAsync(s => s.SwiperId == swiperId && s.SwipedUserId == request.SwipedUserId);

        if (existing != null)
        {
            var existingMatch = await FindMatch(swiperId, request.SwipedUserId);
            return new SwipeResponse { IsMatch = existingMatch != null, MatchId = existingMatch?.Id };
        }

        var swipe = new Swipe
        {
            SwiperId = swiperId,
            SwipedUserId = request.SwipedUserId,
            IsLike = request.IsLike,
            CreatedAt = DateTime.UtcNow
        };

        db.Swipes.Add(swipe);
        await db.SaveChangesAsync();

        if (!request.IsLike)
            return new SwipeResponse { IsMatch = false, MatchId = null };

        var reverselike = await db.Swipes
            .AnyAsync(s => s.SwiperId == request.SwipedUserId && s.SwipedUserId == swiperId && s.IsLike);

        if (!reverselike)
            return new SwipeResponse { IsMatch = false, MatchId = null };

        var user1Id = swiperId < request.SwipedUserId ? swiperId : request.SwipedUserId;
        var user2Id = swiperId < request.SwipedUserId ? request.SwipedUserId : swiperId;

        var match = new Match
        {
            User1Id = user1Id,
            User2Id = user2Id,
            CreatedAt = DateTime.UtcNow
        };

        db.Matches.Add(match);
        await db.SaveChangesAsync();

        return new SwipeResponse { IsMatch = true, MatchId = match.Id };
    }

    private async Task<Match?> FindMatch(Guid swiperId, Guid swipedUserId)
    {
        var user1Id = swiperId < swipedUserId ? swiperId : swipedUserId;
        var user2Id = swiperId < swipedUserId ? swipedUserId : swiperId;

        return await db.Matches
            .FirstOrDefaultAsync(m => m.User1Id == user1Id && m.User2Id == user2Id);
    }
}
