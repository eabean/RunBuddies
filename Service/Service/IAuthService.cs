using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Auth;

namespace RunBuddies.Service
{
    public interface IAuthService
    {
        Task<ActionResult<AuthResponse>> Login(LoginRequest request);
        Task<AuthResponse> RegisterUser(RegisterRequest request);
    }
}