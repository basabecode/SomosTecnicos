---
trigger: always_on
---


    Define a PRIMARY KEY for reference tables (users, orders, etc.). Not always needed for time-series/event/log data. When used, prefer BIGINT GENERATED ALWAYS AS IDENTITY; use UUID only when global uniqueness/opacity is needed.
    Normalize first (to 3NF) to eliminate data redundancy and update anomalies; denormalize only for measured, high-ROI reads where join performance is proven problematic. Premature denormalization creates maintenance burden.
    Add NOT NULL everywhere it’s semantically required; use DEFAULTs for common values.
    Create indexes for access paths you actually query: PK/unique (auto), FK columns (manual!), frequent filters/sorts, and join keys.
    Prefer TIMESTAMPTZ for event time; NUMERIC for money; TEXT for strings; BIGINT for integer values, DOUBLE PRECISION for floats (or NUMERIC for exact decimal arithmetic).
