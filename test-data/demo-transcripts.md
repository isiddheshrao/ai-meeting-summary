# Demo transcripts

Synthetic sample transcripts for testing/demoing the "paste transcript" flow (for meetings that
have already ended). These are fictional, written for this demo and not real recordings, and are
not loaded into the app anywhere. Copy one into the paste-transcript box on a past meeting and
click "Use This Transcript" to see the notes-generation flow end to end without needing a real
recording.

---

## 1. Product sync

```
Priya: Okay, let's keep this quick. Where are we on the beta launch?
Dev: Backend's ready. I finished the rate limiting yesterday and load tests look fine up to 500
concurrent users.
Priya: Great. Sam, what about the frontend?
Sam: Onboarding flow is done. I still need to fix the mobile nav bug before we ship, it's
overlapping the search bar on small screens.
Priya: Can you have that fixed by Thursday?
Sam: Yeah, Thursday works.
Priya: Okay, let's lock the launch date for next Tuesday then. Dev, can you send the invite list
to marketing by Friday?
Dev: Will do.
Priya: One more thing, we still haven't decided on pricing. Sam, can you own getting a proposal
together with finance by early next week?
Sam: Sure, I'll have something by Monday.
Priya: Perfect, thanks everyone.
```

## 2. 1:1 (manager / report)

```
Manager: Hey, how's the week going?
Report: Pretty good. I finished the migration script, it's in review now.
Manager: Nice, who's reviewing it?
Report: Alex is on it, should be done by tomorrow.
Manager: Cool. How are you feeling about the Q3 goals overall?
Report: Mostly on track. The one thing I'm behind on is the documentation task, I keep getting
pulled into support tickets.
Manager: Yeah, I noticed the ticket volume's been high. Let's deprioritize the documentation task
to next quarter so you're not stretched thin.
Report: That would help a lot, thanks.
Manager: Anything you need from me?
Report: Could you approve my conference request when you get a chance? It's still sitting in your
queue.
Manager: Oh sorry, I'll approve it today.
Report: Appreciate it.
```

## 3. Sales discovery call

```
Rep: Thanks for hopping on. So tell me a bit about what you're currently using for this.
Prospect: Right now we're doing it all manually in spreadsheets, it's pretty painful once you get
past like twenty clients.
Rep: Got it. And how many clients are you managing today?
Prospect: About eighty, growing maybe ten a month.
Rep: Okay that's definitely the pain point our tool solves. Can I ask who else would be involved
in a decision like this?
Prospect: Probably me and our ops lead, Jamie. She'd want to see how the reporting works.
Rep: Makes sense. I'll put together a demo focused on the reporting dashboard and send it over by
Friday. Can we get thirty minutes with Jamie next week to walk through it?
Prospect: Let me check her calendar and get back to you.
Rep: Sounds good, I'll follow up Monday if I haven't heard back.
```

## 4. Engineering standup

```
Lead: Let's go around quick. Mia, you're up.
Mia: Yesterday I finished the auth refactor, today I'm starting on the session timeout bug.
Nothing blocking.
Lead: Nice. Theo?
Theo: I'm still stuck on the flaky integration test, it fails maybe one in five runs. I think
it's a race condition in the test setup, not the actual code, but I need another day to confirm.
Lead: Okay, let us know if you want a second pair of eyes on it tomorrow.
Theo: Might take you up on that.
Lead: Priya, how's the deploy pipeline work going?
Priya: Done actually, deploys are down from twelve minutes to four. I'll write up the change and
share it after standup.
Lead: Great, appreciate that. Let's wrap there.
```

## 5. Post-incident retro

```
Facilitator: Let's walk through the timeline. When did we first notice the outage?
Nina: Alerts fired at 2:14pm for elevated error rates on checkout.
Facilitator: And when was it resolved?
Nina: We rolled back the bad deploy at 2:41pm, errors dropped immediately after.
Facilitator: So about 27 minutes of impact. What actually caused it?
Raj: The deploy included a config change that pointed at the wrong database replica. It passed
staging because staging only has one replica.
Facilitator: Okay, that's a good root cause. What should we do differently?
Raj: I think we need a staging environment with multiple replicas so this class of bug gets
caught before prod.
Nina: Agreed. I can also add an alert specifically for replica-mismatch errors so we catch it
faster next time even if it slips through.
Facilitator: Good. Raj, can you file a ticket for the staging environment change?
Raj: Yep, I'll get that filed today.
Facilitator: Nina, same for the new alert?
Nina: Yeah, I'll have that ticket up by tomorrow.
Facilitator: Great, thanks both. I'll write up the incident summary and share it with the team.
```
