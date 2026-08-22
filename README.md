# LEANLINE

A two-person nutrition and training log that runs entirely on your own device.

**Install it:** open the site on a phone, then Add to Home Screen. After the
first visit it works with no network at all.

- No account, no sign-in, no server, no analytics, no tracking.
- Nothing you enter is sent anywhere. It lives in your browser's storage on
  that device and nowhere else.
- Each device is independent. Nothing is shared between them.
- Export your data to a JSON file whenever you like. That file is the only
  backup that exists, so take one.

## What's in this repository

Only a generated build: one HTML file, a service worker, a web manifest and
some icons. There is no personal data of any kind in it — no names, ages,
weights, targets or logs. It ships with no profiles at all and asks you to set
one up on first run.

The build is produced from a separate private repository and the generator
refuses to emit anything if personal data survives the strip.

## Setting up a profile for someone under 18

The app protects a minor's profile permanently and says so during setup:
no weight-loss mode, no calorie target below their estimated needs, no
body-fat field, weighing capped at once a week, no goal line or countdown on
any chart, and targets marked provisional until an adult confirms a clinician
has signed them off. None of that can be switched off afterwards.

It will not invent a calorie target for a child it has no verified equation
for. Where that happens it says so and asks you to enter a figure from a
pediatrician or a dietitian instead.
