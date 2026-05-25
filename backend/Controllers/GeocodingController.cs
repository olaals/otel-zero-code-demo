using Microsoft.AspNetCore.Mvc;
using WeatherWatch.Services;

namespace WeatherWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeocodingController : ControllerBase
{
    private readonly OpenMeteoService _weatherService;

    public GeocodingController(OpenMeteoService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Query is required");

        var result = await _weatherService.SearchLocationsAsync(query);
        return Ok(result);
    }
}
