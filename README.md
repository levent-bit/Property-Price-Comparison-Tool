# Property Price Comparison Tool

A lightweight, condition-aware OTA rate comparison prototype for comparing Halalbooking against other online travel agencies.

## Run

Open `index.html` in Chrome. No installation, backend, API key, or external dependency is required. Click **Load demo** to see sample offers. Enter the Halalbooking baseline and competitor offers manually, then review the equivalence checks and export CSV.

## What is checked

Property name / ID, stay dates, adults, child ages, number of rooms, room category, bed type, view, meal plan, refundability and cancellation deadline, payment timing, availability, and currency. Differences block a like-for-like price comparison. Total includes subtotal, mandatory taxes and fees, and mandatory property charges. Discounts must already be reflected in the subtotal.

## Important limitations

- **No live prices**: No OTA APIs or scraping are connected. Rates must be entered manually and independently verified at checkout.
- Currency conversion is deliberately not attempted; mismatched currencies are flagged.
- Names and room categories require normalization/mapping before production use. This version uses strict text matching and does not claim that identically named rooms are necessarily equivalent.
- Extra benefits and discounts are recorded but not automatically normalized or valued; manually verify those before making a commercial decision.
- Data is stored in localStorage in the browser; do not enter personal data, supplier secrets, credentials, or confidential business information without company authorization.
- Public site scraping may breach terms or be blocked. Prefer licensed partner APIs, approved affiliate feeds, and compliant data providers.
- Before production, implement SSO/RBAC, audit logs, backend encrypted storage, approved API connectors, exchange-rate timestamps, full cancellation penalty schedule, normalized property/room mappings, occupancy and tax logic, freshness/availability checks, and human review.

## Suggested roadmap

1. Import rate offers from approved CSV feeds or supplier APIs.
2. Property ID crosswalk and room equivalence mapping with manual review.
3. Full policy equivalence, payment rules, loyalty/member/mobile discounts, taxes, inclusions, rate provenance and timestamps.
4. Secure backend and scheduled rate monitoring, with price-match case export.

## Privacy

Use only synthetic data in this prototype. Keep the GitHub repository private. Never commit API keys or personal booking data.
