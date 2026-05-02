namespace RunBuddies.DTOs.Matches;

public class MatchResponse
{
    public Guid MatchId { get; set; }
    public DateTime MatchedAt { get; set; }
    public MatchedUserSummary MatchedUser { get; set; } = new MatchedUserSummary();
}
