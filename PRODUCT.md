# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: the author. Registration is open and admin screens exist, but no one else really uses the app. Don't design for onboarding strangers, for multiple tenants, or for growth.

## Product Purpose

Track personal money month by month: log each spend, record the monthly balance, and review where the spending went and how savings and investments are changing. It's working if logging a spend stays fast enough that the habit sticks.

## Positioning

Manual on purpose. Every spend is typed in by hand, because entering it is what builds awareness. There is no bank sync and there won't be. The app is self-built, open source (MIT) and owns its data: no ads, no tracking, no monetization.

## Operating Context

- The most common moment is logging a spend right after paying: on the go, on an iPhone 14 (390px viewport), one-handed. Speed of capture comes first.
- Reviews come less often: the monthly balance, spending overviews and breakdowns, savings and investments charts.
- It's a SPA talking to a separate GraphQL backend (didibudget-backend), deployed at https://didibudget.netlify.app.

## Capabilities and Constraints

- Spending: add, overview, list/administer, monthly breakdown, yearly and monthly overviews, search.
- Monthly balance: add (as year + month), overview charts, list.
- Savings & investments view.
- Categories and subcategories, each with an emoji.
- Auth with JWT in sessionStorage; admin role for user administration.
- Amounts carry a `currencyISO`.
- UI vocabulary: the UI says *spending*, never *expense*.

## Brand Commitments

- Name: didibudget, always lowercase. Logo assets are in `docs-and-assets/`.
- Tagline: "Your money, month by month."

## Evidence on Hand

- Screenshots: `docs-and-assets/preview_01.png` to `preview_04.png`.
- No other users, testimonials or usage metrics exist, and none should be invented.

## Product Principles

1. Capture first: logging a spend on a phone, one-handed, is the hottest path. Nothing gets in its way.
2. Deliberate, not automated: manual entry is the point. Don't add shortcuts that remove the act of noticing.
3. Built for one: optimize for the author's real habits, not for generic personal-finance conventions or acquisition.
4. Your data, nothing else: no ads, no tracking, no third-party calls that don't serve the user.
