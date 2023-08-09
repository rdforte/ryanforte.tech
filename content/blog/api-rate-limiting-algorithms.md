+++
tags = []
date = "2023-08-08T09:16:50+10:00"
draft = false
title = "The Art and Science of API Rate Limiting Algorithms 🧪"
coverImage = "/blog/images/api-rate-limiting-algorithms/cover.png"
coverImageId = "api-rate-limiting-algorithms-cover"
headerImage = "/blog/images/api-rate-limiting-algorithms/header.png"
headerImageId = "api-rate-limiting-algorithms-header"
+++

An API Rate Limiter is a mechanism that enables us to control the rate of requests made to our API (Application Programming Interface). 
This raises the question: why would we need such a thing? If we didn't have a Rate Limiter in place, there would be nothing to prevent users of our API from making a large number of requests in quick succession. 
This could flood our API with internet traffic, overwhelming our services, and potentially causing a decrease in performance or even resulting in the service going down. This can also be referred to as
a DDoS (Distributed Denial of Service) attack. 

A Rate Limiter can also serve the purpose of cost optimization by curbing excessive requests. By imposing limits on both incoming (requests) and outgoing (responses) calls to our services, we can effectively minimize the load on our infrastructure required to handle these API requests. 
This strategic reduction in resource utilization not only enhances operational efficiency but also contributes to a reduction in overall expenditures.

An example of how other companies use Rate Limiters:
- Twitter has a large number of different rate limits which are dependent on the type of auth a user has as well as the endpoint they are hitting. 
You can view more about this at [twitter api rate limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits).
- Google docs is 300 read requests per user per 60 seconds. You can view more about these rate limits at [google docs rate limits](https://developers.google.com/docs/api/limits).
- Facebook Messenger rate limits are counted within a 24-hour period and is equal to 200 * number of engaged users. You can read more about this at [meta rate limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)

Now we know what Rate Limiters are good for let's have a dive into how they are implemented.

## Rate Limiting Algorithms
There are a couple of ways we can implement Rate Limiters with each one having its own distinct pros and cons. Below is a list of common Rate Limiting algorithms
- Token bucket
- Leaking bucket
- Fixed window counter
- Sliding window log
- Sliding window counter

### Token bucket
The token bucket is a widely used algorithms with companies such as Amazon and Stripe adopting this algorithm.
The algorithm works as follows:

We specify a bucket which contains a set number of tokens (capacity). Tokens are then refilled periodically with any excess tokens which exceed the max capacity overflowing and not being added to the bucket.

![token bucket 1](/blog/images/api-rate-limiting-algorithms/token-bucket-1.png)

Every time a request flows through our API we check to see if there are enough tokens in the bucket. If there are enough tokens in the bucket then we process the request.

![token bucket 2](/blog/images/api-rate-limiting-algorithms/token-bucket-2.png)

If the bucket does not have enough tokens in it then we reject the request and return an error.

![token bucket 3](/blog/images/api-rate-limiting-algorithms/token-bucket-3.png)

Usually a token bucket requires 2 parameters. 
- Bucket size.
- Refill rate.

For example, we might have a bucket with a size of 5 and a refill rate of 2 tokens per second.
Three requests hit our API at 10:00:00 AM whereby we deduct 3 tokens from our bucket leaving a total of 2 tokens in the bucket. We then proceed to process the requests.

![token bucket 4](/blog/images/api-rate-limiting-algorithms/token-bucket-4.png)

At 10:00:01 we add 2 extra tokens to the bucket.

![token bucket 5](/blog/images/api-rate-limiting-algorithms/token-bucket-5.png)

Just after adding the 2 extra tokens to the bucket, we get an influx of requests within the same second.

![token bucket 6](/blog/images/api-rate-limiting-algorithms/token-bucket-6.png)

**Pros:** The token bucket is a fairly simple algorithm to implement and allows for short bursts of traffic.

**Cons:** It can be hard to fine tune this algorithm as we only have the bucket size and refill rate to go off.

### Leaking Bucket
The Leaking Bucket algorithm is very similar to that of the Token bucket except we swap out the bucket for a FIFO (First in First out) queue.
We then consume the requests from the queue at a fixed rate.

![leaking bucket 1](/blog/images/api-rate-limiting-algorithms/leaking-bucket-1.png)

If requests are added to the queue faster than the rate which we can process the requests from the queue then we drop the request and return an error.

![leaking bucket 2](/blog/images/api-rate-limiting-algorithms/leaking-bucket-2.png)

The Leaking bucket algorithm usually takes two parameters.
- Queue size.
- Outflow rate.

The queue size is as expressed above where we can only fit 9 items in the queue. Any more than 9 items in the queue and we discard the request and return an error.
The outflow rate is usually how many request we can process at a specified rate usually seconds.

**Pros:** Requests can be processed at a fixed rate which is ideal for throttling inbound requests and a stable outflow is needed.

**Cons:** A burst in traffic if not catered for by the process rate will cause requests to be dropped therefore making this algorithm hard to tune.

### Fixed Window Counter

This approach takes a different direction to the two previous algorithms which had a single bucket or queue.
In the case of the Fixed Window Counter algorithm we divide the time into windows and allocate a counter to each window. 
For example, we might want a window to be 1 second and have a max limit of 10 requests per second.

![fixed window counter 1](/blog/images/api-rate-limiting-algorithms/fixed-window-counter-1.png)

There is a major problem which comes along with using this algorithm. For example, if we allowed a max of 10 requests per 1-minute window, there is a potential that a burst in
traffic at the edges of the window will actually cause more requests to be allowed through than the expected max requests per 1-minute window size.

![fixed window counter 2](/blog/images/api-rate-limiting-algorithms/fixed-window-counter-2.png)

**Pros:** Fairly simple algorithm to understand and implement.

**Cons:** A spike in traffic at the edges of the window can cause more requests through than our intended capacity, so this will have to be taken into account.

### Sliding Window Log
The Fixed Window Counter algorithm has a major flaw whereby it can let through more requests as intended if those requests are on the edges of the window.
The Sliding Window Log algorithm helps to address this issue.

As requests flow through our API we allocate a timestamp to the request and keep track of it along with the other request timestamps. 
For example if we allow a maximum of 5 requests per 60 seconds then this might look like the below:

A new request flows in and there are no other timestamps that we are keeping track of, so we create a timestamp for the new request and keep track of it.

![sliding window log 1](/blog/images/api-rate-limiting-algorithms/sliding-window-1.png)

A few more requests flow in. We compare the timestamp of the current requests to the timestamp of the first request. We can see that they all lie within a time period
of 60 seconds, so we process them.

![sliding window log 2](/blog/images/api-rate-limiting-algorithms/sliding-window-2.png)

Another request then flows in which is within the intended time period but exceeds the number of allowed requests, so we reject it.

![sliding window log 3](/blog/images/api-rate-limiting-algorithms/sliding-window-3.png)

A new request flows through our API, but we can see that this request exceeds the 60-second timeframe when compared to the first, second and third timestamp. We drop the first 3 timestamps therefore leaving us with a total of 4 
timestamps including the current request which therefore leaves us with less than 5 requests within the valid timeframe. As a result we can process this request.

![sliding window log 4](/blog/images/api-rate-limiting-algorithms/sliding-window-4.png)

**Pros:** Very accurate as the window moves with the timestamps therefore fixing the issue that Fixed Window Counter algorithm had. 

**Cons:** Can consume more memory as we still need to keep track of the timestamps for rejected requests.

### Sliding Window Counter
The Sliding Window Counter algorithm seamlessly blends the strengths of both the Fixed Window Counter and Sliding Window Counter approaches. 
We can take on this algorithm from various angles, and one approach elegantly employs the formula outlined below:

```text
C = Requests in current window
P = Requests in the previous window
O = Overlap percentage of the rolling window and previous window

C  + P * O
```

An example of how this might work is lets say we allow 10 requests per minute.

![sliding window counter 1](/blog/images/api-rate-limiting-algorithms/sliding-window-counter-1.png)

Based on the above diagram and formula we can calculate the current rate limit:
```text
7 + 4 * 0.36 = 8.44
```

We can then decide to either round down to 8 or round up to 9. Either way we are within our rate limit threshold of 10 requests.
For the sake of this example lets assume that we are rounding down.

If we decide to add a few more requests to the previous window and then recalculate the rate limit.

![sliding window counter 2](/blog/images/api-rate-limiting-algorithms/sliding-window-counter-2.png)

```text
7 + 8 * 0.53 = 11.24
```

You can see that we now have 11 requests which has exceeded our rate limit, so we reject the request.

**Pros:** Good for smoothing out spikes in traffic as the calculation is based on the average rate of the previous window.

**Cons:** Is not accurate and is just an approximation because it assumes requests in the previous window are evenly distributed.
Based on the [cloudflare article: How we built rate limiting capable of scaling to millions of domains](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/) the Sliding Window Counter
algorithm is still very accurate, as an analysis on 400 million requests from 270,000 distinct sources show:
- 0.003% of requests have been wrongly allowed or rate limited.
- An average difference of 6% between real rate and the approximate rate.

### Conclusion
There you have it folks API rate limiting algorithms play a pivotal role in maintaining the equilibrium between efficient service delivery and safeguarding system integrity. 
By intelligently controlling the pace at which requests are processed, these algorithms prevent undue strain on resources, optimize operational costs, and ensure a fair and reliable user experience. 
Whether employing straightforward token buckets, leaky buckets, or more advanced techniques, the careful implementation of rate limiting strategies empowers organizations to strike an optimal balance between accommodating user demands and preserving the stability and responsiveness of their API-driven services. 
As digital interactions continue to proliferate, the judicious use of API rate limiting algorithms emerges as an essential tool in sustaining the resilience and responsiveness of modern interconnected systems.

### References
[System Design Interview – An insider's guide](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF/ref=sr_1_2?crid=1FBRX02EHZ4IU&keywords=byte+byte+go+system+design&qid=1691540985&sprefix=byte+byte+go%2Caps%2C302&sr=8-2)

[4 Rate Limit Algorithms Every Developer Should Know](https://betterprogramming.pub/4-rate-limit-algorithms-every-developer-should-know-7472cb482f48)

[System Design — Rate limiter and Data modelling](https://medium.com/@saisandeepmopuri/system-design-rate-limiter-and-data-modelling-9304b0d18250)

[Twitter api rate limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits)

[Google docs rate limits](https://developers.google.com/docs/api/limits)

[Meta rate limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)

[How we built rate limiting capable of scaling to millions of domains](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/)

[Throttle API requests for better throughput](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
