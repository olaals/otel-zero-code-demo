using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeatherWatch.Data;
using WeatherWatch.Models;

namespace WeatherWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FavoritesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var favorites = await _db.Favorites
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateFavoriteRequest request)
    {
        var favorite = new Favorite
        {
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Country = request.Country,
            CreatedAt = DateTime.UtcNow
        };

        _db.Favorites.Add(favorite);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = favorite.Id }, favorite);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var favorite = await _db.Favorites.FindAsync(id);
        if (favorite == null)
            return NotFound();

        _db.Favorites.Remove(favorite);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateFavoriteRequest(string Name, double Latitude, double Longitude, string? Country);
