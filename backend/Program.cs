using Microsoft.EntityFrameworkCore;
using WeatherWatch.Data;
using WeatherWatch.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// HTTP client for Open-Meteo
builder.Services.AddHttpClient<OpenMeteoService>();

// Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// SPA fallback middleware: rewrite non-API, non-file requests to index.html
app.Use(async (context, next) =>
{
    await next();

    // If we got a 404 and it's not an API route, serve index.html for SPA routing
    if (context.Response.StatusCode == 404
        && !context.Request.Path.StartsWithSegments("/api")
        && !context.Response.HasStarted)
    {
        context.Response.StatusCode = 200;
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(
            Path.Combine(app.Environment.WebRootPath, "index.html"));
    }
});

// Serve static files (React frontend) from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

// Map API controllers
app.MapControllers();

app.Run();
