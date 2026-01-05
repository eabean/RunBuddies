namespace RunBuddies.Auth;

/// <summary>
/// Configuration settings for JWT token generation and validation.
/// These values are read from appsettings.json.
/// </summary>
public class JwtSettings
{
    public const string SectionName = "JwtSettings";

    /// <summary>
    /// The secret key used to sign tokens. Must be at least 32 characters.
    /// </summary>
    public string Secret { get; set; } = string.Empty;

    /// <summary>
    /// The issuer claim (who created the token).
    /// </summary>
    public string Issuer { get; set; } = string.Empty;

    /// <summary>
    /// The audience claim (who the token is intended for).
    /// </summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>
    /// How long the token is valid for, in minutes.
    /// </summary>
    public int ExpirationMinutes { get; set; } = 60;
}
