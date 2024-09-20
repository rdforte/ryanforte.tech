+++
tags = []
date = "2024-09-20T07:37:28+10:00"
draft = false
title = "Running Go in Containers: The Issue You Didn’t Know Existed 🐳"
coverImage = "/blog/images/go-in-containers-cfs-issue/cover.png"
coverImageId = "go-in-containers-cfs-issue-cover"
headerImage = "/blog/images/go-in-containers-cfs-issue/header.png"
headerImageId = "go-in-containers-cfs-issue-header"
+++

Hello fellow Gopher!

In this article we'll explore a common Go issue, by firstly exploring what GOMAXPROCS is and how it ties into a Linux concept called CFS.
From there, we’ll examine the performance challenges of running Go in containers and why more concurrency isn’t always the answer.
Finally, I’ll share some solutions to help you address these issues and optimize your Go applications in containers.

## Intro to GOMAXPROCS

GOMAXPROCS is an env variable and function from the [runtime package](https://pkg.go.dev/runtime@go1.23.1) that limits
the number of operating system threads that can execute user-level Go code simultaneously.
If GOMAXPROCS is not set then it will default to [runtime.NumCPU](https://pkg.go.dev/runtime@go1.23.1#NumCPU) which is the
number of logical CPU cores available by the current process.
For example if I decide to run my Go application on my shiny new 8 core Mac Pro, then GOMAXPROCS will default to 8.
We are able to configure the number of system threads our Go application can execute by using the runtime.GOMAXPROCS function to override this default.

## What is CFS

CFS was introduced to the Linux kernel in version [2.6.23](https://kernelnewbies.org/Linux_2_6_23) and is the default process scheduler used in Linux.
The main purpose behind CFS is to help ensure that each process gets its own fair share of the CPU proportional to its priority.
In Docker every container has access to all the hosts resources, within the limits of the kernel scheduler.
Though Docker also provides the means to limit these resources through modifying the containers cgroup on the host machine.

## Performance implications of running Go in containers

A common issue I feel Go devs have is always thinking that concurrency is faster and the more threads you are running on the better.
If your someone who thinks this way, I'm sorry but that is not always the case. In fact, more threads can actually slow down our application.
Let me explain why.

Let's imagine a scenario where we configure our ECS Task to use 8 CPU’s and our container to use 4 vCPU’s.

```
{
    "containerDefinitions": [
        {
            "cpu": 4096, // Limit container to 4 vCPU's
        }
    ],
    "cpu": "8192", // Task uses 8 CPU's
    "memory": "16384",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
}
```

The equivalent in Kubernetes will look something along the lines of:

```
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: app
    resources:
      limits:
        cpu: 4
```

In ECS the CPU Period is locked into 100ms. View ECS CPU Period configuration [here](https://github.com/aws/amazon-ecs-agent/blob/d68e729f73e588982dc2189a1c618c18c47c931b/agent/api/task/task_linux.go#L39).
In kubernetes the administrator can configure the **cpu.cfs_period_us** which also has a default value of 100ms.

The CPU Period refers to the time period in microseconds, where the kernel will do some calculations to figure out the allotted amount of CPU time to provide each task.
In the above configuration this would be 4 vCPU’s multiplied by 100ms (cpu period) giving the task 400ms (4 x 100ms).

If all is well and good with our Go application then we would have go routines scheduled on 4 threads across 4 cores.

![4 threads](/blog/images/go-in-containers-cfs-issue/4-threads.png)

For each 100ms period our Go application consumes the full 400 out of 400ms, therefore 100% of the CPU quota.

Now Go is NOT CFS aware [golang/go#33803](https://github.com/golang/go/issues/33803) therefore GOMAXPROCS will default to using all 8 cores of the host.

![8 threads](/blog/images/go-in-containers-cfs-issue/8-threads.png)

Now we have our Go application using all 8 cores resulting in 8 threads executing go routines. After 50ms of execution we reach our CPU
quota 50ms x 8 threads giving us 400ms (8 x 50ms). As a result CFS will throttle our CPU resources, meaning that no more CPU resources will
be allocated till the next period. This means our application will be sitting idle doing nothing for a full 50ms.

If our Go application has an average latency of 50ms this now means a request to our service can take up to 150ms to complete, which is a 300% increase in latency.

## Solution

In Kubernetes this issue is quite easy to solve as we have [uber automaxprocs](https://github.com/uber-go/automaxprocs) package to solve this issue.
Though automaxprocs will not work for ECS [uber-go/automaxprocs#66](https://github.com/uber-go/automaxprocs/issues/66) because the cgroup **cpu.cfs_quota_us** is set to -1 🥲.
That is why I have built [gomaxecs](https://github.com/rdforte/gomaxecs/), which is a package to help address this issue.

## Wrap up

There you have it my fellow Gophers I hope you now have a better understanding of how Go's current CFS issue can impact your application's performance and having more
threads isn't always better. I hope you found this article helpful and if you have any questions or feedback please feel free to reach out to me on [Linkedin](https://www.linkedin.com/in/ryan-forte-43b845135/).

Until next time. Peace ✌️

---

## References

- [Monitor workloads using Amazon ECS metadata](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html)
- [Not understanding the impacts of running Go in Docker and - Kubernetes (#100)](https://100go.co/?h=kubernetes#not-understanding-the-impacts-of-running-go-in-docker-and-kubernetes-100)
- [Linux_2_6_23](https://kernelnewbies.org/Linux_2_6_23)
- [runtime@go1.23.1](https://pkg.go.dev/runtime@go1.23.1)
- [Amazon ECS task metadata endpoint version 4](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html)
- [docker resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
