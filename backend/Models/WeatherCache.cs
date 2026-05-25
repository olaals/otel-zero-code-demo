using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeatherWatch.Models;

[Table("weather_cache")]
public class WeatherCache
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("latitude")]
    public double Latitude { get; set; }

    [Column("longitude")]
    public double Longitude { get; set; }

    [Column("response_json")]
    public string ResponseJson { get; set; } = string.Empty;

    [Column("fetched_at")]
    public DateTime FetchedAt { get; set; } = DateTime.UtcNow;
}
