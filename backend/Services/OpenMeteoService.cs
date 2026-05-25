using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WeatherWatch.Data;
using WeatherWatch.Models;

namespace WeatherWatch.Services;

public class OpenMeteoService
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _db;
    private readonly ILogger<OpenMeteoService> _logger;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    public OpenMeteoService(HttpClient httpClient, AppDbContext db, ILogger<OpenMeteoService> logger)
    {
        _httpClient = httpClient;
        _db = db;
        _logger = logger;
    }

    public async Task<JsonElement> GetWeatherAsync(double latitude, double longitude)
    {
        // Round to 2 decimal places for cache matching
        var lat = Math.Round(latitude, 2);
        var lon = Math.Round(longitude, 2);

        // Check cache
        var cached = await _db.WeatherCaches
            .Where(w => w.Latitude == lat && w.Longitude == lon)
            .OrderByDescending(w => w.FetchedAt)
            .FirstOrDefaultAsync();

        if (cached != null && DateTime.UtcNow - cached.FetchedAt < CacheDuration)
        {
            _logger.LogInformation("Cache hit for {Lat}, {Lon}", lat, lon);
            return JsonSerializer.Deserialize<JsonElement>(cached.ResponseJson);
        }

        // Fetch from Open-Meteo
        var url = $"https://api.open-meteo.com/v1/forecast" +
            $"?latitude={lat}&longitude={lon}" +
            $"&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day" +
            $"&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset" +
            $"&timezone=auto&forecast_days=7";

        _logger.LogInformation("Fetching weather from Open-Meteo for {Lat}, {Lon}", lat, lon);
        var response = await _httpClient.GetStringAsync(url);

        // Update or insert cache
        if (cached != null)
        {
            cached.ResponseJson = response;
            cached.FetchedAt = DateTime.UtcNow;
        }
        else
        {
            _db.WeatherCaches.Add(new WeatherCache
            {
                Latitude = lat,
                Longitude = lon,
                ResponseJson = response,
                FetchedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync();

        return JsonSerializer.Deserialize<JsonElement>(response);
    }

    public async Task<JsonElement> SearchLocationsAsync(string query)
    {
        var url = $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(query)}&count=5&language=en";
        var response = await _httpClient.GetStringAsync(url);
        return JsonSerializer.Deserialize<JsonElement>(response);
    }
}
