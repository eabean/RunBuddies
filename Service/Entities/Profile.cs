namespace RunBuddies.Entities;

public class Profile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string ZipCode { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal PaceMinutes { get; set; }
    public PaceUnit PaceUnit { get; set; } = PaceUnit.MinPerKm;
    public int MatchingRadiusKm { get; set; } = 25;
    public ExperienceLevel ExperienceLevel { get; set; }
    public string? Goals { get; set; }
    public string? Biography { get; set; }
    public string? LookingFor { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    public ICollection<PromptAnswer> PromptAnswers { get; set; } = new List<PromptAnswer>();
}

public enum PaceUnit
{
    MinPerKm = 0,
    MinPerMile = 1
}

public enum ExperienceLevel
{
    NewToRunning = 0,
    Casual = 1,
    Regular = 2,
    Competitive = 3,
    Elite = 4
}
