using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunBuddies.Auth;
using RunBuddies.Data;
using RunBuddies.DTOs.Auth;
using RunBuddies.Entities;
using RunBuddies.Exceptions;

namespace RunBuddies.Service
{
    public class AuthService : IAuthService
    {
        private readonly RunBuddiesDbContext _dbContext;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(RunBuddiesDbContext dbContext, IJwtTokenGenerator jwtTokenGenerator)
        {
            _dbContext = dbContext;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponse> RegisterUser(RegisterRequest request)
        {
            if (_dbContext.Users.Any(u => Equals(u.Email, request.Email)))
                throw new AuthorizationException($"Email {request.Email} has already been registered");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };


            var token = _jwtTokenGenerator.GenerateToken(user);
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

           
            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                HasProfile = false
            };
        }

        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _dbContext.Users
              .Include(u => u.Profile)
              .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                throw new AuthorizationException("Invalid email or password");
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new AuthorizationException("Invalid email or password");

            var token = _jwtTokenGenerator.GenerateToken(user);
            user.LastLoginAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            var authResponse = new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                HasProfile = user.Profile != null
            };

            return authResponse;
        }

    }
}
