using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WeatherWatch.Services;

namespace WeatherWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly OpenMeteoService _weatherService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<RecommendationsController> _logger;

    public RecommendationsController(
        OpenMeteoService weatherService,
        IHttpClientFactory httpClientFactory,
        ILogger<RecommendationsController> logger)
    {
        _weatherService = weatherService;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon)
    {
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            return BadRequest("Invalid coordinates");

        // Get current weather data
        var weatherJson = await _weatherService.GetWeatherAsync(lat, lon);
        var current = weatherJson.GetProperty("current");
        var daily = weatherJson.GetProperty("daily");

        // Extract fields for the recommender
        var payload = new
        {
            temperature = current.GetProperty("temperature_2m").GetDouble(),
            apparent_temperature = current.GetProperty("apparent_temperature").GetDouble(),
            weather_code = current.GetProperty("weather_code").GetInt32(),
            wind_speed = current.GetProperty("wind_speed_10m").GetDouble(),
            precipitation = daily.GetProperty("precipitation_sum")[0].GetDouble(),
            is_day = current.GetProperty("is_day").GetInt32()
        };

        _logger.LogInformation("Requesting recommendations for {Lat}, {Lon}", lat, lon);

        var client = _httpClientFactory.CreateClient("ActivityRecommender");
        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        var response = await client.PostAsync("/api/recommendations", content);
        response.EnsureSuccessStatusCode();

        var resultJson = await response.Content.ReadAsStringAsync();
        return Content(resultJson, "application/json");
    }
}
