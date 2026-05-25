"""Rules-based activity and clothing recommender using weather conditions."""

import logging

logger = logging.getLogger(__name__)

# WMO weather codes grouped by category
_RAIN_CODES = {51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82}
_SNOW_CODES = {71, 73, 75, 77, 85, 86}
_THUNDER_CODES = {95, 96, 99}
_FOG_CODES = {45, 48}


def get_recommendations(
    temperature: float,
    apparent_temperature: float,
    weather_code: int,
    wind_speed: float,
    precipitation: float,
    is_day: int,
) -> dict:
    activities: list[str] = []
    clothing: list[str] = []
    notes: list[str] = []

    is_rainy = weather_code in _RAIN_CODES
    is_snowy = weather_code in _SNOW_CODES
    is_thunder = weather_code in _THUNDER_CODES
    is_foggy = weather_code in _FOG_CODES
    is_clear = weather_code <= 3
    feels_like = apparent_temperature

    # --- Temperature rules ---
    if feels_like < -10:
        logger.debug("Temperature rule: extreme cold (feels_like=%.1f)", feels_like)
        clothing.extend(["Heavy winter coat", "Thermal layers", "Insulated boots", "Gloves", "Scarf"])
        notes.append("Extremely cold -- limit time outdoors.")
    elif feels_like < 0:
        logger.debug("Temperature rule: freezing (feels_like=%.1f)", feels_like)
        clothing.extend(["Winter coat", "Warm layers", "Boots", "Gloves", "Hat"])
        notes.append("Freezing temperatures, dress warmly.")
    elif feels_like < 10:
        logger.debug("Temperature rule: chilly (feels_like=%.1f)", feels_like)
        clothing.extend(["Warm jacket", "Long trousers", "Closed shoes"])
        notes.append("Chilly conditions.")
    elif feels_like < 20:
        logger.debug("Temperature rule: mild (feels_like=%.1f)", feels_like)
        clothing.extend(["Light jacket or sweater", "Comfortable trousers"])
        notes.append("Mild and comfortable.")
    elif feels_like < 30:
        logger.debug("Temperature rule: warm (feels_like=%.1f)", feels_like)
        clothing.extend(["T-shirt", "Light trousers or shorts"])
        notes.append("Warm weather, dress lightly.")
    else:
        logger.debug("Temperature rule: hot (feels_like=%.1f)", feels_like)
        clothing.extend(["Light breathable clothing", "Hat", "Sunscreen"])
        notes.append("Hot weather -- stay hydrated and seek shade.")

    # --- Precipitation rules ---
    if is_rainy:
        logger.debug("Precipitation rule: rain (weather_code=%d)", weather_code)
        clothing.append("Waterproof jacket")
        clothing.append("Umbrella")
        activities.append("Visit a museum")
        activities.append("Cafe hopping")
        notes.append("Rain expected, bring rain gear.")
    elif is_snowy:
        logger.debug("Precipitation rule: snow (weather_code=%d)", weather_code)
        clothing.append("Waterproof boots")
        clothing.append("Warm hat")
        activities.append("Skiing or snowboarding")
        activities.append("Build a snowman")
        notes.append("Snowfall expected.")
    elif is_thunder:
        logger.debug("Precipitation rule: thunderstorm (weather_code=%d)", weather_code)
        activities.append("Stay indoors")
        activities.append("Board games or movie night")
        notes.append("Thunderstorms -- avoid open areas.")

    # --- Wind rules ---
    if wind_speed > 50:
        logger.debug("Wind rule: very strong (wind_speed=%.1f)", wind_speed)
        clothing.append("Windbreaker")
        notes.append("Very strong winds, be cautious outdoors.")
    elif wind_speed > 30:
        logger.debug("Wind rule: moderate-strong (wind_speed=%.1f)", wind_speed)
        clothing.append("Windbreaker")
        notes.append("Windy conditions.")

    # --- Fog rules ---
    if is_foggy:
        logger.debug("Fog rule applied (weather_code=%d)", weather_code)
        notes.append("Foggy -- reduced visibility, drive carefully.")
        activities.append("Indoor workout")

    # --- Good weather activities ---
    if is_clear and not is_thunder:
        if feels_like >= 20:
            activities.extend(["Hiking", "Cycling", "Picnic in the park"])
            if feels_like >= 28:
                activities.append("Swimming")
        elif feels_like >= 10:
            activities.extend(["Walking", "Jogging", "Sightseeing"])
        elif feels_like >= 0:
            activities.extend(["Brisk walk", "Winter photography"])
        else:
            activities.append("Short walk if well-dressed")

    # --- Day/Night rules ---
    if is_day == 0:
        if is_clear:
            activities.append("Stargazing")
        clothing.append("Reflective gear if walking")

    # --- Daytime sun protection ---
    if is_day == 1 and is_clear and feels_like >= 20:
        clothing.append("Sunglasses")
        if "Sunscreen" not in clothing:
            clothing.append("Sunscreen")

    # --- Fallback if no activities ---
    if not activities:
        if is_clear:
            activities.append("Enjoy the outdoors")
        else:
            activities.append("Indoor activities recommended")

    # Build summary
    summary = " ".join(notes)

    result = {
        "activities": list(dict.fromkeys(activities)),  # dedupe, preserve order
        "clothing": list(dict.fromkeys(clothing)),
        "summary": summary,
    }

    logger.info(
        "Recommendation generated: %d activities, %d clothing items, summary='%s'",
        len(result["activities"]),
        len(result["clothing"]),
        summary,
    )

    return result
