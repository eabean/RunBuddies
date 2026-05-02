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

        public async Task<AuthResponse> Register(RegisterRequest request)
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

                _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user);
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
            var user = await GetUser(request);

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

        public async Task<ActionResult<AuthResponse>> Refresh(LoginRequest request)
        {
           
            var user = await GetUser(request);

            var token = _jwtTokenGenerator.GenerateToken(user);

            var authResponse = new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                HasProfile = user.Profile != null
            };

            return authResponse;
        }

        public async Task<User> GetUser(LoginRequest request)
        {
            var user = await _dbContext.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                throw new AuthorizationException("User was not found.");
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new AuthorizationException("Credentials are not correct.");

            var token = _jwtTokenGenerator.GenerateToken(user);

            return user;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                throw new AuthorizationException("Invalid email or password");
            }
            
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new AuthorizationException("Invalid email or password");
            }
            
            var token = _jwtTokenGenerator.GenerateToken(user);  // Pass user object instead
            
            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                HasProfile = user.Profile != null
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                throw new AuthorizationException("Email already registered");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),  // MUST hash here
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                HasProfile = false
            };
        }
    }
}
