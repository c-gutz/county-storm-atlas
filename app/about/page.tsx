export default function About(){
    return (
        <main className="mx-auto max-w-[65ch] px-6 py-20 sm:py-28">
        <header>
            <p className="text-xs uppercase tracking-[0.16em] text-black/40">About</p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Project Overview
            </h1>

            <p className="mt-5 text-base leading-relaxed text-black/50 sm:text-lg">
            For more information and project files, see the GitHub repo at https://github.com/c-gutz/county-storm-atlas.
            </p>
        </header>

        <article
            className="mt-12 border-t border-black/10 pt-12
                    [&>h2]:mt-14 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:tracking-tight
                    [&>h3]:mt-9 [&>h3]:text-[0.9375rem] [&>h3]:font-semibold [&>h3]:tracking-tight
                    [&>p]:mt-6 [&>p]:text-[0.9375rem] [&>p]:leading-[1.75] [&>p]:text-black/70
                    sm:[&>p]:text-base
                    [&>*:first-child]:mt-0
                    [&_a]:underline [&_a]:decoration-black/25 [&_a]:underline-offset-4
                    [&_a:hover]:decoration-black
                    [&_strong]:font-semibold [&_strong]:text-black
                    [&>ul]:mt-6 [&>ul]:space-y-2.5 [&>ul]:pl-5 [&>ul]:text-[0.9375rem] [&>ul]:leading-[1.75] [&>ul]:text-black/70
                    sm:[&>ul]:text-base
                    [&>ul>li]:relative [&>ul>li]:pl-6
                    [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[0.7em]
                    [&>ul>li]:before:h-1 [&>ul>li]:before:w-1 [&>ul>li]:before:bg-black/25 [&>ul>li]:before:content-['']"
        >
            <p>
            Built on the back of three decades of NOAA storm data and climatic features, 
            this tool provides an interactive map and an analog page to assess both the historic 
            and current risks of every contiguous U.S. county.
            </p>

            <p>
            It is designed to serve as a clear and concise interface for accessing each county's
            historic storm distribution, usable both for broad regional policy and individual
            safety planning.
            </p>

            <h2>The Storm Events Database </h2>

            <p>
            This resource draws majorly from the NOAA's Storm Events Database.
            Important features of this data will be described in greater detail below.
            </p>

            <h3> Overview </h3>

            <p>
            NOAA's Storm Events Database is a public record of individual storm events in the United States, 
            storing descriptions and severity indicators like casualties and property damage. 
            </p>

            <p>
            While its earliest data traces back to 1950, NOAA only began recording its complete list of events in 1996, 
            effectively setting the maximum scope of this tool.
            </p>

            <h3> Counties and zones </h3>

            <p>
            One complication regarding this dataset lies in the logging of events. The map and analog systems of this
            project run strictly by county, but NOAA's records combine both county and zone data.
            </p>

            <p>
            These zones, officially called NWS Forecast Zones, often contain multiple counties, blurring the line between
            the consequences of a given storm on each involved county.
            </p>

            <p> 
            To rectify this, I created a zone-to-county crosswalk that converted these zonal events back into standard county 
            logs, dividing storm damages and casualties between involved counties on the basis of population.
            </p>

            <p>
            This strategy retained 97.42% of the last three decades' nominal property damages. 
            </p>

            <h3> Inflation and estimates </h3>

            <p>
            Storm Events does not account for inflation. To display relevant historic distributions, I adjusted all 
            records to reflect their "real" value in 2026. 
            </p>

            <p> 
            On the subject of reading and interpreting NOAA's values, it is important to recognize that NOAA's storm
            damage values are often estimates rather than indisputable facts. While largely accurate, the distributions 
            built off of Storm Events are subject to the same noise.
            </p>

            <p>
            Additionally, while Storm Events reports both property and crop damage, this project focuses solely on property
            damage.
            </p>

            <h2> The Map </h2>
            
            <p> 
            The map is a fairly straightforward visualizer of the Storm Events Database. It allows users to hover over
            an interactive choropleth, or search for their specific county directly.
            </p>

            <p> 
            Each county's color in the choropleth is determined by that county's total property damage over the last
            three decades in the selected season. Different seasons can be toggled easily to display new results.
            </p>

            <h3> Specific features </h3>

            <p> 
            While most of the features on the map are self-explanatory, some warrant additional explanation.
            </p>

            <p>
            The conditional monthly damage percentiles are, as their name suggests, built only off of months with a recorded 
            event. Given the nature of outliers in these storm events, different percentiles require a different number of event
            months in order to be displayed.
            </p>

            <p>
            The list below describes the minimum number of event months for each percentile to show.
            </p>
            <ul>
                <li> Q50: 5 events</li>
                <li> Q75: 10 events </li>
                <li> Q90: 20 events</li>
                <li> Q95: 30 events </li>
            </ul>

            <p>
            Also worth mentioning are the "Chance of Exceeding" probabilities, which are not conditional. These probabilities
            represent the historic, per-month odds for any given county in the specified season to exceed a given property damage
            amount.
            </p>

            <h2> The Analogs </h2>
            
            <h3> The Data </h3>
            <p>
            The analog page combines Storm Events with two other datasets: ERA5-Land and NOAA's Niño 3.4 Index. 
            </p>

            <p>
            ERA5-Land is a reanalysis dataset offering a wide range of climatic features. In particular, the analogs use 
            antecedent precipitation over the past three months, 2 m temperature anomaly, and volumetric soil water 
            (28–100 cm).
            </p>

            <p>
            NOAA's Niño 3.4 Index is a measure of the sea surface temperature anomaly in the Niño 3.4 region in the Pacific.
            It is typically used to classify between El Niño, La Niña, and ENSO-neutral periods.
            </p>

            <h3> Methodology </h3>

            <p>
            ERA5-Land has a lag time of around a month when accessed through Google Earth Engine, meaning that truly
            real-time values are not available.
            </p>

            <p>
            Instead, the analogs work by pulling the conditions for a given county's previous month and finding the five most
            similar months in that county's history. 
            </p>

            <p>
            When searching for similar months, candidates are restricted to the 
            target month and the months on either side of it. For example, if August's values are being used, only 
            July-September months will be considered.
            </p>

            <p>
            Similarity here represents the Euclidean distance between the four features:
            Niño 3.4, antecedent precipitation over the past three months, 2 m temperature anomaly, and volumetric soil 
            water (28–100 cm). 
            </p>

            <p>
            When displaying, the analog page returns the months directly after the five selected months. This allows for 
            relevant analog results built off of antecedent features.
            </p>

            <p>
            In summary, the analog page searches a given county's historical distribution for similarity to last month's values, 
            returning the storm consequences for the months immediately after those deemed similar.
            </p>

            <h3> Limitations </h3>

            <p>
            Admittedly, five analogs per county is not a lot. For readability purposes, the number of analogs has been limited
            to five, but it should be noted that this does not encompass the full range of similar historical months.
            </p>

            <p>
            Also, the overall predictive skill of the four features used, when isolated as they are, is minimal. Ultimately, the 
            analogs should be used as a reference, not a forecast.
            </p>

            <h2> The Original Idea Behind the Project</h2>

            <p> 
            If you have perused the project files at all, you may have noticed a number of extraneous Jupyter Notebook files
            that have seemingly no use in the final project. This is correct.
            </p>

            <p>
            The initial idea behind the project was to predict property damage and casualties using Niño 3.4 and an array of
            other features. The full list of features are listed below.
            </p>

            <ul>
                <li>
                    Dynamic: Niño 3.4, 2 m temperature anomaly, antecedent precipitation (3 and 6 months), 
                    2 m dewpoint temperature anomaly, average monthly wind speed, volumetric soil water (28-100 cm)
                </li>
                <li>
                    Slow-moving Dynamic: population density, poverty rate, 
                    antecedent property damage (12 and 60 months), antecedent storm deaths (12 and 60 months) 
                </li>
                <li> 
                    Static: latitude, longitude, % without a vehicle, distance to nearest coastline, HAND 
                    (height above nearest drainage) vulnerability
                </li>
            </ul>

            <p>
            Despite this extensive data wrangling, the predictive results were modest at best. To handle the zero-inflated
            and skewed nature of the property damage and death labels, I settled on a hurdle model.
            </p>

            <p>
            Compared to a base rate of 0.13, my hurdle classifier achieved a PR-AUC of 0.34, a 2.6x increase. However,
            running that same classifier with just my static features produced a PR-AUC of 0.328. Outside of the features 
            outlining which county was being examined, there was very little skill. 
            </p>

            <p> 
            The regressor, intended to predict storm severity conditional on an event's occurrence, was even less useful. 
            </p>

            <p>
            I attribute this failure to two main things. For one, my initial goal, as well as the lag time of my various 
            features, required that prediction be made at least two months out. With a large portion of my events being sudden
            convective storms, this was never going to work. Additionally, the inconsistencies in NOAA's Storm Events added
            even more unexplainable noise.
            </p>

            <p>
            Either way, I decided that displaying and interpreting distributions was more suited to the data I had than 
            predicting.
            </p>

            <p>
            I hope you find this tool useful, and feel free to reach out with additional questions.
            </p>

        </article>
        </main>
    )
}