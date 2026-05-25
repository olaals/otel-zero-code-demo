using Microsoft.AspNetCore.Mvc;
using WeatherWatch.Services;

namespace WeatherWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly OpenMeteoService _weatherService;

    public WeatherController(OpenMeteoService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon)
    {
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            return BadRequest("Invalid coordinates");

        var result = await _weatherService.GetWeatherAsync(lat, lon);
        return Ok(result);
    }
}
