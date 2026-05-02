using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RunBuddies.Data;
using RunBuddies.DTOs.Discovery;
using RunBuddies.Infrastructure;

namespace RunBuddies.Service;

public class DiscoveryService(RunBuddiesDbContext db, IOptions<S3Settings> s3Options) : IDiscoveryService
{
    private readonly S3Settings _s3 = s3Options.Value;

    public async Task<List<DiscoveryProfileResponse>> GetProfiles(Guid currentUserId, int page)
    {
        var swipedUserIds = await db.Swipes
            .Where(s => s.SwiperId == currentUserId)
            .Select(s => s.SwipedUserId)
            .ToListAsync();

        var profiles = await db.Profiles
            .Where(p => p.UserId != currentUserId && !swipedUserIds.Contains(p.UserId))
            .Include(p => p.Photos.Where(ph => ph.IsMain))
            .Include(p => p.PromptAnswers)
                .ThenInclude(pa => pa.Prompt)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * 10)
            .Take(10)
            .ToListAsync();

        return profiles.Select(p => new DiscoveryProfileResponse
        {
            UserId = p.UserId,
            FirstName = p.FirstName,
            Age = CalculateAge(p.DateOfBirth),
            ExperienceLevel = (int)p.ExperienceLevel,
            PaceMinutes = p.PaceMinutes,
            PaceUnit = (int)p.PaceUnit,
            Biography = p.Biography,
            LookingFor = p.LookingFor,
            MainPhotoUrl = p.Photos.FirstOrDefault() is { } photo
                ? $"https://{_s3.BucketName}.s3.{_s3.Region}.amazonaws.com/{photo.FilePath}"
                : null,
            PromptAnswers = p.PromptAnswers.Select(pa => new DiscoveryPromptAnswer
            {
                PromptText = pa.Prompt.PromptText,
                AnswerText = pa.AnswerText
            }).ToList()
        }).ToList();
    }

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age)) age--;
        return age;
    }
}
