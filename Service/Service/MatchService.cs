using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RunBuddies.Data;
using RunBuddies.DTOs.Matches;
using RunBuddies.Entities;
using RunBuddies.Infrastructure;

namespace RunBuddies.Service;

public class MatchService(RunBuddiesDbContext db, IOptions<S3Settings> s3Options) : IMatchService
{
    private readonly S3Settings _s3 = s3Options.Value;

    public async Task<List<MatchResponse>> GetMatches(Guid userId)
    {
        var matches = await db.Matches
            .Where(m => m.User1Id == userId || m.User2Id == userId)
            .Include(m => m.User1).ThenInclude(u => u.Profile!).ThenInclude(p => p.Photos.Where(ph => ph.IsMain))
            .Include(m => m.User1).ThenInclude(u => u.Profile!).ThenInclude(p => p.PromptAnswers).ThenInclude(pa => pa.Prompt)
            .Include(m => m.User2).ThenInclude(u => u.Profile!).ThenInclude(p => p.Photos.Where(ph => ph.IsMain))
            .Include(m => m.User2).ThenInclude(u => u.Profile!).ThenInclude(p => p.PromptAnswers).ThenInclude(pa => pa.Prompt)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return matches.Select(m => MapToResponse(m, userId)).ToList();
    }

    private MatchResponse MapToResponse(Match match, Guid currentUserId)
    {
        var otherUser = match.User1Id == currentUserId ? match.User2 : match.User1;
        var profile = otherUser.Profile;
        var mainPhoto = profile?.Photos.FirstOrDefault();

        return new MatchResponse
        {
            MatchId = match.Id,
            MatchedAt = match.CreatedAt,
            MatchedUser = new MatchedUserSummary
            {
                FirstName = profile?.FirstName ?? string.Empty,
                ContactInfo = profile?.ContactInfo,
                MainPhotoUrl = mainPhoto != null
                    ? $"https://{_s3.BucketName}.s3.{_s3.Region}.amazonaws.com/{mainPhoto.FilePath}"
                    : null,
                ExperienceLevel = profile != null ? (int)profile.ExperienceLevel : 0,
                PaceMinutes = profile?.PaceMinutes ?? 0,
                PaceUnit = profile != null ? (int)profile.PaceUnit : 0,
                PromptAnswers = profile?.PromptAnswers.Select(pa => new MatchPromptAnswer
                {
                    PromptText = pa.Prompt.PromptText,
                    AnswerText = pa.AnswerText
                }).ToList() ?? new List<MatchPromptAnswer>()
            }
        };
    }
}
