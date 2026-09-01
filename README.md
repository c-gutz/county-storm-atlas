# county storm atlas 

Storm damage distributions for every county in the contiguous US. Thirty years of NOAA data, mapped by season, with historical analogs for current conditions.

## Project Overview

Built on the back of three decades of NOAA storm data and climatic features, this tool provides an interactive map and an analog page to assess both the historic and current risks of every contiguous U.S. county.

It is designed to serve as a clear and concise interface for accessing each county's historic storm distribution, usable both for broad regional policy and individual safety planning.

## The Storm Events Database

This resource draws majorly from the NOAA's Storm Events Database. Important features of this data will be described in greater detail below.

### Overview

NOAA's Storm Events Database is a public record of individual storm events in the United States, storing descriptions and severity indicators like casualties and property damage.

While its earliest data traces back to 1950, NOAA only began recording its complete list of events in 1996, effectively setting the maximum scope of this tool.

### Counties and zones

One complication regarding this dataset lies in the logging of events. The map and analog systems of this project run strictly by county, but NOAA's records combine both county and zone data.

These zones, officially called NWS Forecast Zones, often contain multiple counties, blurring the line between the consequences of a given storm on each involved county.

To rectify this, I created a zone-to-county crosswalk that converted these zonal events back into standard county logs, dividing storm damages and casualties between involved counties on the basis of population.

This strategy retained 97.42% of the last three decades' nominal property damages.

### Inflation and estimates

Storm Events does not account for inflation. To display relevant historic distributions, I adjusted all records to reflect their "real" value in 2026.

On the subject of reading and interpreting NOAA's values, it is important to recognize that NOAA's storm damage values are often estimates rather than indisputable facts. While largely accurate, the distributions built off of Storm Events are subject to the same noise.

Additionally, while Storm Events reports both property and crop damage, this project focuses solely on property damage.

## The Map

The map is a fairly straightforward visualizer of the Storm Events Database. It allows users to hover over an interactive choropleth, or search for their specific county directly.

Each county's color in the choropleth is determined by that county's total property damage over the last three decades in the selected season. Different seasons can be toggled easily to display new results.

### Specific features

While most of the features on the map are self-explanatory, some warrant additional explanation.

The conditional monthly damage percentiles are, as their name suggests, built only off of months with a recorded event. Given the nature of outliers in these storm events, different percentiles require a different number of event months in order to be displayed.

The list below describes the minimum number of event months for each percentile to show.

- Q50: 5 events
- Q75: 10 events
- Q90: 20 events
- Q95: 30 events

Also worth mentioning are the "Chance of Exceeding" probabilities, which are not conditional. These probabilities represent the historic, per-month odds for any given county in the specified season to exceed a given property damage amount.

## The Analogs

### The Data

The analog page combines Storm Events with two other datasets: ERA5-Land and NOAA's Niño 3.4 Index.

ERA5-Land is a reanalysis dataset offering a wide range of climatic features. In particular, the analogs use antecedent precipitation over the past three months, 2 m temperature anomaly, and volumetric soil water (28–100 cm).

NOAA's Niño 3.4 Index is a measure of the sea surface temperature anomaly in the Niño 3.4 region in the Pacific. It is typically used to classify between El Niño, La Niña, and ENSO-neutral periods.

### Methodology

ERA5-Land has a lag time of around a month when accessed through Google Earth Engine, meaning that truly real-time values are not available.

Instead, the analogs work by pulling the conditions for a given county's previous month and finding the five most similar months in that county's history.

When searching for similar months, candidates are restricted to the target month and the months on either side of it. For example, if August's values are being used, only July-September months will be considered.

Similarity here represents the Euclidean distance between the four features: Niño 3.4, antecedent precipitation over the past three months, 2 m temperature anomaly, and volumetric soil water (28–100 cm).

When displaying, the analog page returns the months directly after the five selected months. This allows for relevant analog results built off of antecedent features.

In summary, the analog page searches a given county's historical distribution for similarity to last month's values, returning the storm consequences for the months immediately after those deemed similar.

### Limitations

Admittedly, five analogs per county is not a lot. For readability purposes, the number of analogs has been limited to five, but it should be noted that this does not encompass the full range of similar historical months.

Also, the overall predictive skill of the four features used, when isolated as they are, is minimal. Ultimately, the analogs should be used as a reference, not a forecast.

## The Original Idea Behind the Project

If you have perused the project files at all, you may have noticed a number of extraneous Jupyter Notebook files that have seemingly no use in the final project. This is correct.

The initial idea behind the project was to predict property damage and casualties using Niño 3.4 and an array of other features. The full list of features are listed below.

- Dynamic: Niño 3.4, 2 m temperature anomaly, antecedent precipitation (3 and 6 months), 2 m dewpoint temperature anomaly, average monthly wind speed, volumetric soil water (28-100 cm)
- Slow-moving Dynamic: population density, poverty rate, antecedent property damage (12 and 60 months), antecedent storm deaths (12 and 60 months)
- Static: latitude, longitude, % without a vehicle, distance to nearest coastline, HAND (height above nearest drainage) vulnerability

Despite this extensive data wrangling, the predictive results were modest at best. To handle the zero-inflated and skewed nature of the property damage and death labels, I settled on a hurdle model.

Compared to a base rate of 0.13, my hurdle classifier achieved a PR-AUC of 0.34, a 2.6x increase. However, running that same classifier with just my static features produced a PR-AUC of 0.328. Outside of the features outlining which county was being examined, there was very little skill.

The regressor, intended to predict storm severity conditional on an event's occurrence, was even less useful.

I attribute this failure to two main things. For one, my initial goal, as well as the lag time of my various features, required that prediction be made at least two months out. With a large portion of my events being sudden convective storms, this was never going to work. Additionally, the inconsistencies in NOAA's Storm Events added even more unexplainable noise.

Either way, I decided that displaying and interpreting distributions was more suited to the data I had than predicting.

I hope you find this tool useful, and feel free to reach out with additional questions.