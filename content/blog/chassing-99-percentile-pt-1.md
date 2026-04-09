+++
tags = []
date = "2026-04-08T07:46:54+10:00"
draft = false
title = "Chasing the 99th Percentile: Go Performance Tuning on Linux. Pt 1 - Building a mental model."
coverImage = "/blog/images/chassing-99-percentile-pt-1/cover.png"
coverImageId = "chassing-99-percentile-pt-1-cover"
headerImage = "/blog/images/chassing-99-percentile-pt-1/header.png"
headerImageId = "chassing-99-percentile-pt-1-header"
+++

## Disclaimer

This article is built entirely on my understanding and mental model of the Go Scheduler, CFS and CPU clock cycles.
I’ve tried to validate everything based on external sources but If I have made a mistake or something is not entirely accurate then feel free to shoot me a message on my [LinkedIn](https://www.linkedin.com/in/rdforte/) 🙂

## Introduction

This article was starting to get a bit long, still is pretty long 😅 so I have decided to break it into 3 parts:

- Pt 1 Building a mental model.
- Pt 2 Understanding your tools.
- Pt 3 Putting it together with benchmarks.

So what is P99? It is the 99th percentile of distribution or in latency terms it means 99% of request/response times
finish within this time. For example if a web servers P99 latency was 3 seconds and we measured 100 requests
then out of those 100 requests 99 would return in 3 seconds or under.
Chasing an improved Tail Latency - anything above P90 can be a long road and further drilling down into P99 can be
an even longer, winding road filled with detour, pot holes and dangerous obstacles along the way. It’s no small
challenge tackling P99 but optimising for the **1%** of users that experience these slow latencies can make
big impacts at scale. For example back in 2006 Amazon found that for every 100ms added to page load times resulted in
them losing ~1% in sales. The 1% of users that were experiencing these large page load times lead to users abandoning
their carts and not coming back which lead to approximately $107 million in sales left on the table that never
converted!!

![P99 Bell Curve](/blog/images/chassing-99-percentile-pt-1/bell_curve.png)

Hopefully in this three part series I’ll arm you with the insight and tools you need to sculpt a high performance Go
application. Just as a master sculptor understands the grain of their medium and the precise impact of every chisel
strike to craft a masterpiece, we must understand the "material" of the underlying systems we work on top of.

In Part 1 We will delve into the Go scheduler, Linux Scheduler and part of the CPU to help build a mental model of how
these systems cooperate. Developing this clarity will hopefully give you the technical depth required to solve the kind
of complex problems that remain unreachable without a deep understanding of these systems.

## A look under the hood - The Go Scheduler

![User Space](/blog/images/chassing-99-percentile-pt-1/you_are_in_user_space.png)

If you have worked with concurrency in the past (coroutines in Kotlin and goroutines in Go) you may be familiar with
the different multi threading models. There’s typically three models _many-to-one (N:1)_, _one-to-one (1:1)_
and _many-to-many (M:N)_.

![Threading Models](/blog/images/chassing-99-percentile-pt-1/threading_models.png)

Go opts in for the many-to-many (M:N) model which provides a high level of concurrency because if one thread blocks
another can continue where with a many-to-one (M:1) if one thread blocks then it blocks the entire process. With
one-to-one there is no blocking of the other threads If one thread decides to block but the overhead is higher compared
to many-to-many because each user thread ie: goroutine requires a corresponding OS Thread thereby making the M:N
model a great fit for the Go Scheduler.

The Go scheduler is part of the Go runtime and its main responsibility is the orchestration and running of goroutines
which are lightweight application threads starting at 2KB in size as defined by
[stackMin](https://github.com/golang/go/blob/go1.24.0/src/runtime/stack.go#L75-L75). We can create a new
goroutine by using the go keyword followed by a function call. Every new instance of a goroutine contains metadata
such as the execution state, stack and program counter pointing to the associated function.

When we spin up a new Go application the runtime will reach out to the machine (virtual or physical) and identify how
many cores there are. It will then use this number to create its own internally managed logical processors to represent
these cores via struct [p](https://github.com/golang/go/blob/go1.24.0/src/runtime/runtime2.go#L632-L757)
which we will refer to as P. For every P or logical processor that the scheduler manages it
will own its own OS Thread or machine Thread which is controlled by by struct 
[m](https://github.com/golang/go/blob/go1.24.0/src/runtime/runtime2.go#L528-L630), which we will refer to as M.
The struct m holds a reference to the current goroutine G and the current logical processor P if the M is executing
go code.
