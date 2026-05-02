using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RunBuddies.Data;
using RunBuddies.DTOs.Profiles;
using RunBuddies.Entities;
using RunBuddies.Infrastructure;

namespace RunBuddies.Service;

public class ProfileService(RunBuddiesDbContext db, IOptions<S3Settings> s3Options) : IProfileService
{
    private readonly S3Settings _s3 = s3Options.Value;

    public async Task<ProfileResponse> CreateProfile(Guid userId, CreateProfileRequest request)
    {
        var exists = await db.Profiles.AnyAsync(p => p.UserId == userId);
        if (exists)
            throw new InvalidOperationException("Profile already exists for this user.");

        var profile = new Profile
        {
            UserId = userId,
            FirstName = request.FirstName,
            DateOfBirth = request.DateOfBirth,
            ZipCode = request.ZipCode,
            PaceMinutes = request.PaceMinutes,
            PaceUnit = (PaceUnit)request.PaceUnit,
            MatchingRadiusKm = request.MatchingRadiusKm,
            ExperienceLevel = (ExperienceLevel)request.ExperienceLevel,
            Goals = request.Goals,
            Biography = request.Biography,
            LookingFor = request.LookingFor,
            ContactInfo = request.ContactInfo
        };

        db.Profiles.Add(profile);
        await db.SaveChangesAsync();

        return MapToResponse(profile);
    }

    public async Task<ProfileResponse> GetProfile(Guid userId)
    {
        var profile = await db.Profiles
            .Include(p => p.Photos)
            .Include(p => p.PromptAnswers)
                .ThenInclude(pa => pa.Prompt)
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Profile not found.");

        return MapToResponse(profile);
    }

    public async Task<ProfileResponse> UpdateProfile(Guid userId, UpdateProfileRequest request)
    {
        var profile = await db.Profiles
            .Include(p => p.Photos)
            .Include(p => p.PromptAnswers)
                .ThenInclude(pa => pa.Prompt)
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Profile not found.");

        if (request.FirstName != null) profile.FirstName = request.FirstName;
        if (request.DateOfBirth != null) profile.DateOfBirth = request.DateOfBirth.Value;
        if (request.ZipCode != null) profile.ZipCode = request.ZipCode;
        if (request.PaceMinutes != null) profile.PaceMinutes = request.PaceMinutes.Value;
        if (request.PaceUnit != null) profile.PaceUnit = (PaceUnit)request.PaceUnit.Value;
        if (request.MatchingRadiusKm != null) profile.MatchingRadiusKm = request.MatchingRadiusKm.Value;
        if (request.ExperienceLevel != null) profile.ExperienceLevel = (ExperienceLevel)request.ExperienceLevel.Value;
        if (request.Goals != null) profile.Goals = request.Goals;
        if (request.Biography != null) profile.Biography = request.Biography;
        if (request.LookingFor != null) profile.LookingFor = request.LookingFor;
        if (request.ContactInfo != null) profile.ContactInfo = request.ContactInfo;

        profile.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return MapToResponse(profile);
    }

    private ProfileResponse MapToResponse(Profile profile) => new()
    {
        Id = profile.Id,
        UserId = profile.UserId,
        FirstName = profile.FirstName,
        DateOfBirth = profile.DateOfBirth,
        ZipCode = profile.ZipCode,
        PaceMinutes = profile.PaceMinutes,
        PaceUnit = (int)profile.PaceUnit,
        MatchingRadiusKm = profile.MatchingRadiusKm,
        ExperienceLevel = (int)profile.ExperienceLevel,
        Goals = profile.Goals,
        Biography = profile.Biography,
        LookingFor = profile.LookingFor,
        ContactInfo = profile.ContactInfo,
        CreatedAt = profile.CreatedAt,
        UpdatedAt = profile.UpdatedAt,
        Photos = profile.Photos.Select(ph => new PhotoResponse
        {
            Id = ph.Id,
            Url = $"https://{_s3.BucketName}.s3.{_s3.Region}.amazonaws.com/{ph.FilePath}",
            IsMain = ph.IsMain,
            DisplayOrder = ph.DisplayOrder
        }).ToList(),
        PromptAnswers = profile.PromptAnswers.Select(pa => new PromptAnswerResponse
        {
            PromptId = pa.PromptId,
            PromptText = pa.Prompt.PromptText,
            AnswerText = pa.AnswerText
        }).ToList()
    };
}
