using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Auth;

namespace RunBuddies.Service
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterRequest request);
        Task<ActionResult<AuthResponse>> Login(LoginRequest request);

        Task<ActionResult<AuthResponse>> Refresh(LoginRequest request);
    }
}