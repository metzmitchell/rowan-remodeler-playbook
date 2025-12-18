## 3. OUTPUT SPECIFICATION — XML ONLY

#############################################
Return a **single, well-formed XML document** matching this schema:

```xml
<Report generated_at="ISO-8601">
<ExecutiveSummary>…≤200 words…</ExecutiveSummary>

<InitialPotentialInsights>
<Hypothesis id="1" confidence="high">
<![CDATA[
Insurance-related opportunities ~40 % of pipeline value but show the
lowest close-rate so far.
]]>
</Hypothesis>
…
</InitialPotentialInsights>

<AggregateMetrics currency="USD">
<Totals> … </Totals>
<Period type="Year" value="2025"> … </Period>
…
</AggregateMetrics>

<TopEntities> … </TopEntities>

<RegionalBreakdown> … </RegionalBreakdown>

<Anomalies> … </Anomalies>

<StaleDeals threshold_days="90"> … </StaleDeals>

<Insights>
<Insight id="1"> <![CDATA[ … ]]></Insight>
…
</Insights>

<Recommendations>
<Recommendation id="1"> <![CDATA[ … ]]></Recommendation>
…
</Recommendations>

<Methodology> <![CDATA[ … ]]></Methodology>
</Report>
```

#############################################
