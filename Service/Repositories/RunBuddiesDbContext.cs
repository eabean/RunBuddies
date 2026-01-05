using Microsoft.EntityFrameworkCore;
using RunBuddies.Entities;

namespace RunBuddies.Data;

public class RunBuddiesDbContext : DbContext
{
    public RunBuddiesDbContext(DbContextOptions<RunBuddiesDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Photo> Photos => Set<Photo>();
    public DbSet<Prompt> Prompts => Set<Prompt>();
    public DbSet<PromptAnswer> PromptAnswers => Set<PromptAnswer>();
    public DbSet<Swipe> Swipes => Set<Swipe>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Message> Messages => Set<Message>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        // Profile configuration
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.ZipCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);
            entity.Property(e => e.PaceMinutes).HasPrecision(5, 2).IsRequired();
            entity.Property(e => e.MatchingRadiusKm).HasDefaultValue(25);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            entity.HasIndex(e => e.ZipCode);

            entity.HasOne(e => e.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // Photo configuration
        modelBuilder.Entity<Photo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.FilePath).HasMaxLength(500).IsRequired();
            entity.Property(e => e.IsMain).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.HasIndex(e => e.ProfileId);

            entity.HasOne(e => e.Profile)
                .WithMany(p => p.Photos)
                .HasForeignKey(e => e.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Prompt configuration
        modelBuilder.Entity<Prompt>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.PromptText).HasMaxLength(255).IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            // Seed data
            entity.HasData(
                new Prompt { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), PromptText = "My ideal running partner would...", IsActive = true },
                new Prompt { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), PromptText = "My favorite post-run treat is...", IsActive = true },
                new Prompt { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), PromptText = "The best running advice I ever got was...", IsActive = true },
                new Prompt { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), PromptText = "My most memorable run was...", IsActive = true },
                new Prompt { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), PromptText = "I started running because...", IsActive = true },
                new Prompt { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), PromptText = "My running playlist must include...", IsActive = true },
                new Prompt { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), PromptText = "My dream race to complete is...", IsActive = true }
            );
        });

        // PromptAnswer configuration
        modelBuilder.Entity<PromptAnswer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.AnswerText).HasMaxLength(500).IsRequired();
            entity.HasIndex(e => e.ProfileId);
            entity.HasIndex(e => new { e.ProfileId, e.PromptId }).IsUnique();

            entity.HasOne(e => e.Profile)
                .WithMany(p => p.PromptAnswers)
                .HasForeignKey(e => e.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Prompt)
                .WithMany(p => p.PromptAnswers)
                .HasForeignKey(e => e.PromptId);
        });

        // Swipe configuration
        modelBuilder.Entity<Swipe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.HasIndex(e => new { e.SwiperId, e.SwipedUserId }).IsUnique();
            entity.HasIndex(e => e.SwipedUserId);

            entity.HasOne(e => e.Swiper)
                .WithMany(u => u.SwipesMade)
                .HasForeignKey(e => e.SwiperId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.SwipedUser)
                .WithMany(u => u.SwipesReceived)
                .HasForeignKey(e => e.SwipedUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Match configuration
        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.HasIndex(e => new { e.User1Id, e.User2Id }).IsUnique();
            entity.HasIndex(e => e.User1Id);
            entity.HasIndex(e => e.User2Id);

            // Check constraint: User1Id < User2Id (ensures consistent ordering)
            entity.ToTable(t => t.HasCheckConstraint("CK_Match_UserOrder", "\"User1Id\" < \"User2Id\""));

            entity.HasOne(e => e.User1)
                .WithMany()
                .HasForeignKey(e => e.User1Id)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User2)
                .WithMany()
                .HasForeignKey(e => e.User2Id)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Message configuration
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.SentAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.HasIndex(e => e.MatchId);

            entity.HasOne(e => e.Match)
                .WithMany(m => m.Messages)
                .HasForeignKey(e => e.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Sender)
                .WithMany(u => u.MessagesSent)
                .HasForeignKey(e => e.SenderId);
        });
    }
}
