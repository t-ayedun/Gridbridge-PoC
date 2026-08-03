# ADR 002: Modular Public Dataset Surrogates for AEDC Network Pre-Validation

## Status
Accepted

## Context
Official proprietary GIS and SCADA data for the Abuja Electricity Distribution Company (AEDC) network is currently pending formal release. The PoC platform required immediate, realistic validation of power flow engines, mini-grid sizing, and investment prioritization algorithms.

## Decision
Utilize high-quality public dataset surrogates (EPRI J1 feeder for OpenDSS load flow, KEDCO for DisCo asset structure, SE4ALL for commercial market clusters, DRE Atlas for village demand, and Open-Meteo for Abuja solar irradiance) behind a unified, modular ingestion and processing pipeline.

## Consequences
- **Pros**: Unblocks immediate platform development and stakeholder demonstrations; provides robust pipeline interfaces ready for drop-in replacement when AEDC data arrives.
- **Cons**: Synthetic electrical power flow results reflect EPRI topology rather than exact AEDC feeder parameters until AEDC `.dss` files are integrated.
