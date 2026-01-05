namespace RunBuddies.DTOs.Auth;

public class AuthResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public bool HasProfile { get; set; }
}
