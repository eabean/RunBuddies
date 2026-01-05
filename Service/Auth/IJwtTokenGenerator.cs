using RunBuddies.Entities;

namespace RunBuddies.Auth;

/// <summary>
/// Interface for generating JWT tokens.
/// </summary>
public interface IJwtTokenGenerator
{
    /// <summary>
    /// Generates a JWT token for the given user.
    /// </summary>
    /// <param name="user">The user to generate a token for.</param>
    /// <returns>The JWT token string.</returns>
    string GenerateToken(User user);
}
