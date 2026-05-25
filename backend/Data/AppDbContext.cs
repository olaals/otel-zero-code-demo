using Microsoft.EntityFrameworkCore;
using WeatherWatch.Models;

namespace WeatherWatch.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<WeatherCache> WeatherCaches => Set<WeatherCache>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WeatherCache>()
            .HasIndex(w => new { w.Latitude, w.Longitude });
    }
}
