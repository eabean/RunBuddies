namespace RunBuddies.Exceptions
{
    public class AuthorizationException : Exception
    {
        public AuthorizationException(string msg)
            : base("AuthorizationException: " + msg)
        {
        }
    }
}
