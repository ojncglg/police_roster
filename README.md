# Assignment 1

## Objective

For Assignment 1 (A1) we are going to be building a component libary that we can use for future assignments. Our goal main goal is to layout the building blocks components that will be composed together to create our final bigger components. We will focus on compisition, component interfaces, and styling. We aren't going to focus on functionality quiet yet and at first our components will be very static.

## What are we building?

In the fitness world, there are lots of different ways a workout can be timed. For example, we can use a traditional stopwatch, a count-down timer, an interval timer, etc. To support our athletes, we’ll be building 4 differet types of timers:
<br/>
<br/>
| Timer type | Description |
|-|-|
| Stopwatch | A timer that counts up to X amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0)  
| Countdown | A timer that counts down from X amount of time (e.g. count down to 0, starting at 2 minutes and 30)  
| XY | A timer that counts down from X time per round, for Y number of rounds (e.g. 1 minute for 10 minutes would count down from 1 minute to 0, then start another countdown, etc, 10 times )
| TABATA | An interval timer with work/rest periods. Example: 20s/10s, 8 rounds, would count down from 20 seconds to 0, then count down from 10 seconds to 0, then from 20, then from 10, etc, for 8 rounds. A full round includes both the work and rest. In this case, 20+10=30 seconds per round.

<br/>

Here we are thinking about mainly UI/UX. What is information is most important to my end user? How does that change as the workout progress? How is my UI going to improve their workout? etc ...

Our larger components are going to be `Stopwatch`, `Countdown`, `XY`, and `TABATA`, but you can imagine that we have common functionality. An example is a start button. All timers are going to have to have a way to start. Our goal is to take these large components and extract common functionality into smaller components. We might have a `Button` component that is shared by all of our timers and it might have a prop that we pass in that changes the background color in order to create a start `Button` and a stop `Button`.

## Deliverable

1. Create generic components that are going to be used by your timers. The most basic ones, but not limited to, are going to be a `Button`, `Input`, `DisplayTime`, `DisplayRounds`, and `Panel` (that handles layout of your timer).
2. Assemble your timers using these generic. They should render below your documentation.

```

# Install and Run Project

```

npm i & npm start

```

```
