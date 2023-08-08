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

![fixed window counter 1](/blog/images/api-rate-limiting-algorithms/fixed-window-counter-2.png)

**Pros:** Fairly simple algorithm to understand and implement.

**Cons:** A spike in traffic at the edges of the window can cause more requests through than our intended capacity, so this will have to be taken into account.
