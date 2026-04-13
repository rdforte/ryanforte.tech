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

This article is built entirely on my understanding and mental model of the Go
Scheduler, CFS and CPU clock cycles. I’ve tried to validate everything based on
external sources but If I have made a mistake or something is not entirely
accurate then feel free to shoot me a message on my
[LinkedIn](https://www.linkedin.com/in/rdforte/) 🙂

## Introduction

This article was starting to get a bit long, still is pretty long 😅 so I have
decided to break it into 3 parts:

- Pt 1 Building a mental model.
- Pt 2 Understanding your tools.
- Pt 3 Putting it together with benchmarks.

So what is P99? It is the 99th percentile of distribution or in latency terms it
means 99% of request/response times finish within this time. For example if a
web servers P99 latency was 3 seconds and we measured 100 requests then out of
those 100 requests 99 would return in 3 seconds or under. Chasing an improved
Tail Latency - anything above P90 can be a long road and further drilling down
into P99 can be an even longer, winding road filled with detour, pot holes and
dangerous obstacles along the way. It’s no small challenge tackling P99 but
optimising for the **1%** of users that experience these slow latencies can make
big impacts at scale. For example back in 2006 Amazon found that for every 100ms
added to page load times resulted in them losing ~1% in sales. The 1% of users
that were experiencing these large page load times lead to users abandoning
their carts and not coming back which lead to approximately $107 million in
sales left on the table that never converted!!

![P99 Bell Curve](/blog/images/chassing-99-percentile-pt-1/bell_curve.png)

Hopefully in this three part series I’ll arm you with the insight and tools you
need to sculpt a high performance Go application. Just as a master sculptor
understands the grain of their medium and the precise impact of every chisel
strike to craft a masterpiece, we must understand the "material" of the
underlying systems we work on top of.

In Part 1 We will delve into the Go scheduler, Linux Scheduler and part of the
CPU to help build a mental model of how these systems cooperate. Developing this
clarity will hopefully give you the technical depth required to solve the kind
of complex problems that remain unreachable without a deep understanding of
these systems.

## A look under the hood - The Go Scheduler 🏎️

![User Space](/blog/images/chassing-99-percentile-pt-1/you_are_in_user_space.png)

If you have worked with concurrency in the past (coroutines in Kotlin and
goroutines in Go) you may be familiar with the different multi threading models.
There’s typically three models _many-to-one (N:1)_, _one-to-one (1:1)_ and
_many-to-many (M:N)_.

![Threading Models](/blog/images/chassing-99-percentile-pt-1/threading_models.png)

Go opts in for the many-to-many (M:N) model which provides a high level of
concurrency because if one thread blocks another can continue where with a
many-to-one (M:1) if one thread blocks then it blocks the entire process. With
one-to-one there is no blocking of the other threads If one thread decides to
block but the overhead is higher compared to many-to-many because each user
thread ie: goroutine requires a corresponding OS Thread thereby making the M:N
model a great fit for the Go Scheduler.

The Go scheduler is part of the Go runtime and its main responsibility is the
orchestration and running of goroutines which are lightweight application
threads starting at 2KB in size as defined by
[stackMin](https://github.com/golang/go/blob/go1.24.0/src/runtime/stack.go#L75-L75).
We can create a new goroutine by using the go keyword followed by a function
call. Every new instance of a goroutine contains metadata such as the execution
state, stack and program counter pointing to the associated function.

When we spin up a new Go application the runtime will reach out to the machine
(virtual or physical) and identify how many cores there are. It will then use
this number to create its own internally managed logical processors to represent
these cores via struct
[p](https://github.com/golang/go/blob/go1.24.0/src/runtime/runtime2.go#L632-L757)
which we will refer to as P. For every P or logical processor that the scheduler
manages it will own its own OS Thread or machine Thread which is controlled by
by struct
[m](https://github.com/golang/go/blob/go1.24.0/src/runtime/runtime2.go#L528-L630),
which we will refer to as M. The struct m holds a reference to the current
goroutine G and the current logical processor P if the M is executing go code.

The best way to think about the P is that it acts as the middle man or bridge
between our go application and the OS.

![P Bridge](/blog/images/chassing-99-percentile-pt-1/p_bridge.png)

Now the Go scheduler is responsible for the orchestration of goroutines which
are managed my struct g, which we will refer to as G. So what the scheduler will
do is take these goroutines (G’s) and assign them a P where the P will then run
the G on an M (machine thread). This means that for each logical processor P we
can have at most 1 M and for each M it can be running at most 1 G. Its a 1:1:1
ratio. This is referred to as the _GMP Model_.

![GMP Model](/blog/images/chassing-99-percentile-pt-1/PMG.png)

For example if I were to bring up the system report of my MacBook and inspect
the number of cores, you would see that I have a total of 8 cores. This would
result in my go application having a total of 8 P’s there by allowing me to run
8 goroutines in parallel. If your a coffee fan thats kind of like having 8
gophers all making coffee at the same time!!!

![Gopher Coffee](/blog/images/chassing-99-percentile-pt-1/the_gopher_bar.png)

Goroutines are similar to OS Threads in the sense that like OS threads which can
be context switched on/off a core a goroutine can be context switched on/off a
M. Though a goroutines lifecycle is much simpler than an OS thread and it can be
in one of 3 states:

- **Executing** → The goroutine has been placed on a M and is executing its
  instructions.
- **Runnable** → The goroutine is waiting to be in an executing state
- **Waiting** → The goroutine has been moved off the M and is placed in a
  waiting state. This usually happens when the goroutine has to perform some IO
  or synchronisation like acquiring a mutex.

![Goroutine States](/blog/images/chassing-99-percentile-pt-1/goroutine_states.png)

So I said there were just 3 states…. I lied. There are actually a couple more
which are not as significant as the main 3 but worth mentioning:

- **Idle** → goroutine created but not initialised.
- **Syscall** → Executing a system call and not running go code.
- **Dead** → The goroutine is in what is called the free list.

I just want to quickly touch on the the Dead state because this is partly why
goroutines are so optimal. When a goroutine finishes executing it is dead 🪦 and
is placed into what is referred to as the free list. This will either be the
local free list of the P or a global free list. When a new goroutine is created
it will try to recycle an old goroutine from the free list otherwise it will
spin up a new one. This recycling process ♻️ is what makes goroutines so cheap
to create!

![Goroutine Recycle](/blog/images/chassing-99-percentile-pt-1/recycle_goroutines.png)

Now if a goroutine is the main path of execution and if your spinning up
multiple G’s more than the num are available then what happens to those G’s?
Well short answer is queueing.

When a goroutine has no place to go it is placed on either the
[runq](https://github.com/golang/go/blob/go1.24.0/src/runtime/runtime2.go#L654-L654)
(a local fixed size circular queue of goroutine pointers) which is managed by a
P or the global queue. The fixed size queue of 256 is sufficient enough for a
local queue and the circular structure which uses the
[ring buffer algorithm](https://en.wikipedia.org/wiki/Circular_buffer) enables
the adding and removing of goroutines in constant time O(1) without the need to
shift the array.

![Goroutine scheduler queue](/blog/images/chassing-99-percentile-pt-1/golang_scheduler_queue.png)

So what happens in the case above where M1 has moved the G off the OS Thread and
doesn’t have a G to run? The answer is stealing! The go scheduler is referred to
as a work stealing scheduler. What this means is that if an M is free then the P
can look out to the global queue and other P’s local queues and if it sees a G
in either of these queues it can steal it and place it on it’s M. This allows
for an under-utilised P to find work.

![Gopher stealing G's from P Houses](/blog/images/chassing-99-percentile-pt-1/gopher_steeling_p.png)

Lastly in the early days of Go prior to Go 1.14 if a goroutine had a tight loop
performing cpu bound work (i’ll touch on cpu bound work later) then the thread
would hold on to this goroutine until all the work was completed there by
creating a backlog of goroutines which had nothing to do but sit idle waiting
for this long cpu bound task to complete. Us Gophers could get around this by
using
[runtime.Gosched()](https://github.com/golang/go/blob/go1.24.0/src/runtime/proc.go#L358-L365)
in the body of the loop though this was very tedious and error prone and did
have some perf issues. More details on this here →
[runtime: tight loops should
be preemptib le #10958](https://github.com/golang/go/issues/10958).

Though in Go 1.14 the Go team decided to move away from a cooperative scheduler
and instead moved to a preemptive scheduler which solved a lot of these issues.
At a high level Go runs a daemon on a dedicated thread M called sysmon (system
monitor) which is not attached to any P. When sysmon finds a goroutine that has
been running for longer than 10ms as defined by
[forcePreemptNS](https://github.com/golang/go/blob/356b87fa7bbba02debea59d2d03e1eca1750ccb6/src/runtime/proc.go#L6658)
it sends a [tgkill](https://man7.org/linux/man-pages/man2/tgkill.2.html) signal
(the name is misleading. It does no killing just sends a signal to the process
✉️) to the M running the goroutine. The goroutine will then be suspended and put
into the global run queue where it will be later picked back up by a P. This
then frees up other goroutines to do work ensuring a fairer balance of goroutine
time on the OS Thread.

## Go's I/O Model 📬

To understand how Go handles IO we need to take a look at _blocking_,
_non-blocking_ and _multiplexing IO_.

With your typical blocking IO operations a thread will suspend or pause until
the system is ready with the requested data. On the other hand non-blocking IO
does NOT suspend and the Linux Kernel will return the requested data if its
there or an error _EAGAIN_ or _EWOULDBLOCK_ which are two error codes that share
the same value as outlined by
[POSIX.1-2001](https://man7.org/linux/man-pages/man3/errno.3.html#:~:text=POSIX.1%2D2001%5C%5C)
that signify Resource temporarily unavailable.

![Blocking vs Non Blocking IO](/blog/images/chassing-99-percentile-pt-1/blocking_vs_nonblocking.png)

In I/O Multiplexing a combination of and
[select()](https://man7.org/linux/man-pages/man2/select.2.html)
[poll()](https://man7.org/linux/man-pages/man2/poll.2.html) system calls are
used for monitoring multiple file descriptors that will later become ready to
perform I/O. Our application will block on one of these system calls rather than
on [recvfrom](https://man7.org/linux/man-pages/man3/recvfrom.3p.html) as used by
blocking and non-blocking models. The multiplexing model uses _select_ to notify
our application that a socket is readable in which case our application can then
make the system call via _recvfrom_.

![IO Multiplexing](/blog/images/chassing-99-percentile-pt-1/io_multiplexing.png)

Go uses a combination of non-blocking and multiplexing models to handle I/O
efficiently but select and poll are extremely inefficient in comparison to
[Linux epoll](https://man7.org/linux/man-pages/man7/epoll.7.html). Linux epoll
is an API (_epoll_create, epoll_ctl, epoll_wait_) that is used to monitor
multiple file descriptors to see if they are ready for I/O.

From the users perspective epoll contains two lists:

- The interest list which contains a set of file descriptors the process has
  registered an interest in monitoring which can be registered via _epoll_ctl_.
- The ready list which contains a list of those file descriptors we are
  interested in that are ready to perform I/O. We can monitor this list via
  _epoll_wait_ which will block the calling thread if no events are currently
  available.

![Epoll](/blog/images/chassing-99-percentile-pt-1/epoll.png)

A single thread using epoll can handle tens of thousands of concurrent requests
and is a lot more efficient in comparison to other mechanism’s such as poll and
select as shown in the following experiment from the book
[Linux Programming Interface](https://man7.org/tlpi/).

![Epoll comparison](/blog/images/chassing-99-percentile-pt-1/epoll_comparison.png)
_Table taken from pg 1365 of The Linux Programming Interface by Michael
Kerrisk._

What I love about the Go scheduler is its ability to leverage Linux epoll.

If a Goroutine needs to perform a network based system call then Go has the
ability to move this G off the M and place it in what is called the Net Poller
which in turn registers the file descriptor using _epoll_ctl_ with
_EPOLL_CTL_ADD_. This then prevents the goroutine from blocking the M and frees
it up to run another goroutine.

Go’s
[net poller](https://github.com/golang/go/blob/master/src/runtime/netpoll_epoll.go)
then uses the _epoll_wait_ system call to then collect batches of 128 where it
then cycles these events back to the go scheduler.

Lastly it’s important to clean up these file descriptors to avoid starving a
goroutine. This is done by calling _epoll_ctl_ with _EPOLL_CTL_DEL_ operation
which will unregister the file descriptor in the epoll interest list.

What is clever about this approach is that this moves the hard work of
processing network requests from the scheduler to the OS.

Prior to Go 1.25 any P could use the net poller instance but for workloads that
were leveraging a large number of cores this lead to serious cpu time spent on
_epoll_wait_ so as part of Go1.25 the netpoller is only polled from a single
thread in order to avoid kernel contention →
[runtime: only poll network from one P at a time in findRunnable](https://go-review.googlesource.com/c/go/+/669235)

If your also interested there are talks of potentially using
[io_uring](https://www.man7.org/linux/man-pages/man7/io_uring.7.html) for doing
file I/O. If you are interested you can read about it in the paper
[Efficient IO with io_uring](https://kernel.dk/io_uring.pdf) or if you want to
follow the discussion on GitHub you can go here
[internal/poll: transparently support new linux io_uring interface #31908](https://github.com/golang/go/issues/31908).

## Diving one level deeper - The Linux OS Scheduler 🐧

![You are at Linux OS](/blog/images/chassing-99-percentile-pt-1/you_are_in_os_space.png)

Our Go Scheduler uses a OS Thread (M) to run its goroutines but what is the M
really? Threads are the smallest unit of processing an OS can perform. They are
responsible for executing instructions on the hardware. Every process running on
our machines is allocated at least 1 thread with the ability for this thread to
spawn more threads.

Similar to our Go Scheduler an OS Thread can also be in 3 states:

- **Executing**: The thread is placed on a core and is running its instructions.
- **Runnable**: The thread is is hanging out and waiting to be executed.
- **Waiting**: The thread was running but has been stopped and is now waiting to
  be placed on a core again.

Each Thread can perform two types of work:

- **CPU-Bound**: This is work that results in the thread never being able to be
  placed into a waiting state and often times involves some sort of calculation
  like calculating the
  [nth Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_sequence).
- **IO-Bound**: This type of work on the other hand can cause the thread to be
  placed into a waiting state and often times involves performing:
  - Network calls
  - System calls
  - Synchronisation events, things like atomic operations and mutexes.
