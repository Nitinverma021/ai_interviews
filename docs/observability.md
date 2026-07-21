# Observability

Umami is configured for page views through the root layout and custom events
through `data-umami-event` attributes.

Tracked events:

- `signin`
- `signup`
- `start_interview`
- `generate_interview`
- `start_voice_interview`
- `finish_interview`
- `view_interview`
- `view_feedback`
- `retake_interview`
- `update_profile`

Recommended next layer: add server-side error tracking such as Sentry, Axiom, or
Logtail for API route and server action failures.
