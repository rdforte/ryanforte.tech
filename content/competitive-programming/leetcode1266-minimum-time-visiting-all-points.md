+++
"competitive-programming" = ["show-all", "math"]
date = "2022-11-20T08:49:22+11:00"
draft = false
title = "Leetcode1266 Minimum Time Visiting All Points"
difficulty = "easy"
platform = "leetcode"
+++

[LeetCode question 1266](https://leetcode.com/problems/minimum-time-visiting-all-points/)

Lets start by breaking down what this question is asking of us.
We are given a __2D plane__ with __n__ number of points where each point contains an __x__ and __y__ value.

Using the points provided we must visit each point in the order they are given to us in the least amount of time.
The rules for the question state the following.

In 1 second, you can either:
- move vertically by one unit,
- move horizontally by one unit, or
- move diagonally sqrt(2) units (in other words, move one unit vertically then one unit horizontally in 1 second).

Therefore based on the above whether we move horizontally, vertically or diagonally it is all considered 1 second.
Lets take a look at how this might look between two points on a graph.

![visualise point](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/visualise-path.png)

Based on the above diagram if we were to move horizontally and vertically only it would take 2 seconds.

![visualise points max](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/visualise-path-max.png)

If we were to just move diagonally it would be 1 second.

![visualise points min](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/visualise-path-min.png)

_Therefore based on the above I think it is safe to say that when given two points we should always try and maximize the
use of the diagonal path where possible._

### Approach

Ok so If we were given two points on a graph how would we determine the min time in seconds between each one of these points?
Lets start by drawing this out on a graph using the points __(x1, y1)__ and __(x3, y4)__.

![visualise points x](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/visualise-path-2-points.png)

Based on the above diagram we can see that if we want to utilize the diagonal path the max we can move diagonally is __x3 - x1__. Therefore
the difference of the x points. But this may not be the case for every point sometimes we may need to utilize the diagonal of the y points
over the x points as shown in the diagram below.

![visualise points y](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/visualise-path-2-points-y.png)

In this case it would be __y3 - y1__ to get the diagonal because utilizing the x values will give us the wrong diagonal value.
So then how do we know which diagonal to utilize?
Based on the above examples we recognize a simple pattern that we are actually taking the minimum difference between the X points and the Y points
to get our diagonal values.
This then leaves us with our vertical and horizontal values to calculate the remainder of our points. This can simply be done by doing just that,
calculating the remainder between the X and the Y points.

![calculation](/competitive-programming/images/leetcode1266-minimum-time-visiting-all-points/calculation.png)

### Solution

```cpp
#include <bits/stdc++.h>

using namespace std;

int minTimeToVisitAllPoints(vector<vector<int>> &points)
{
  if (points.size() == 1)
    return 0;
  int ans = 0;
  for (int i = 1; i < points.size(); i++)
  {
    int x = abs(points[i][0] - points[i - 1][0]);
    int y = abs(points[i][1] - points[i - 1][1]);
    ans += min(x, y) + abs(x - y);
  }
  return ans;
};
```

### Space and Time Complexity
- __Time Complexity__: O(n) where n represents the number of points.
- __Space Complexity__: O(1) We need to keep track of the difference of x and difference of y on each iteration of our loop.
