using RunBuddies.DTOs.Matches;

namespace RunBuddies.Service;

public interface IMatchService
{
    Task<List<MatchResponse>> GetMatches(Guid userId);
}
