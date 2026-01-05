using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RunBuddies.Entities;
using RunBuddies.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RunBuddies.Auth;

/// <summary>
/// Generates JWT tokens for authenticated users.
/// </summary>
public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenGenerator(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[] {
           new Claim(JwtRegisteredClaimNames.Sub, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        var writtenToken = tokenHandler.WriteToken(token);
        if (writtenToken == null) throw new AuthorizationException("JWT token could not be generated.");

        return writtenToken;
    }
}
