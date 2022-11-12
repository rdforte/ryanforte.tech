+++
"competitive-programming" = ["show-all"]
date = "2022-11-13T08:36:43+11:00"
draft = false
title = "HackerRank Street Lights"
difficulty = "medium"
platform = "hackerrank"
+++

[HackerRank Street Lights question](https://www.hackerrank.com/contests/algoholic-contest-1/challenges/street-lights/problem)

In order to solve this question we must first try and understand what the question is asking of us.

We have a road and along this road we have a number of street lights with each street light lighting up a number
of points either side of it. Our job is to figure out how many points do these street lights light up in total.
It's usually best to draw a diagram to represent the problem so lets do that.

As an example if we have 2 street lights which light up 2 points either side. We can represent this as the following.

![street light question](/competitive-programming/images/hackerrank-street-lights/street-light-question.png)

From what we can see in the above image, the points in which the light polls light up are
__-1, 0, 1, 2, 3, 5, 6, 7, 8, 9__ therefore the total number of points our street light covers is __10__.

There are a few edge cases which we must consider.

Firstly what if two street lights are on the same point?

![street light same point](/competitive-programming/images/hackerrank-street-lights/street-light-question-same-point.png)

Because street lights __1__ and __2__ light up the same points we still only include the number of points which are lit up
and not the total number of points each street light lights up. Therefore are result here is still __10__

What if we have two street which are not located on the same point but but either light up the same points?

![street light next to each other](/competitive-programming/images/hackerrank-street-lights/street-lights-nexto.png)

Because both street lights light up __point 3__ we can only include 3 once so the total points here would be
__-1, 0, 1, 2, 3, 4, 5, 6, 7__ therefore the total number of points would be __9__.

The last edge case we must consider is if the lights overlap each other.

![street light next to each other](/competitive-programming/images/hackerrank-street-lights/street-lights-overlap.png)

The result of this is very similar to the result in the previous edge case. Because both lights light up points __2__ and __3__
we only include these points once which leaves the points lit up to be __-1, 0, 1, 2, 3, 4, 5__ and our result is therefore __7__.

### Approach

How I have approached this question may be different to how others have approached this question. Though this approach will get
you 30/30 points on HackerRank.

If we line up all of our street lights side by side and only calculate the light of the current street pole up to the light
of the next street pole then this will cater for any overlapping light.

![street light next to each other](/competitive-programming/images/hackerrank-street-lights/street-light-solution.png)

At each iteration of the street poles we can then calculate the difference between the bounds of the light
- __Light Pole 1__: 2 - -1 = 3
- __Light Pole 2__: 6 - 2 = 4

If we then add these together we get __7__ but hold up wait a second shouldn't the answer be __8__ 🧐

We know that for the difference of the bounds of each light we must also include the point for the light pole itself.
In which case we have two lights. So then would we not add 2? If the lights were not overlapping or touching then yes we
could include each light poles point in the total number of points but because in our example above they overlap so essentially
its as if they were one light pole. So to overcome this we can keep track of the total number of light poles and each time
one light poles light overlaps another light poles light we can deduct one from the total number of points.

### Solution

```cpp
#include <bits/stdc++.h>

using namespace std;

int main()
{
  int numTestCases;
  cin >> numTestCases;

  while (numTestCases--)
  {
    int n, k;
    cin >> n >> k;

    vector<pair<int, int>> coverage;

    while (n--)
    {
      int light;
      cin >> light;
      coverage.push_back({light - k, light + k});
    }

    sort(coverage.begin(), coverage.end());

    int count = coverage.size();

    for (int i = 0; i < coverage.size(); i++)
    {
      bool isLastLight = i == coverage.size() - 1;
      int lower = coverage[i].first;
      auto nextLight = isLastLight ? coverage[i].second : coverage[i + 1].first;
      int upper = min(coverage[i].second, nextLight);

      if (!isLastLight && coverage[i].second >= coverage[i + 1].first)
        count--;

      count += (upper - lower);
    }

    cout << count << "\n";
  }
}
```

### Space and Time Complexity
- __Space Complexity__: O(n) We need to keep track of an array of light poles which have the upper and lower bounds of the light.
- __Time Complexity__: O(n.log.n) We need to sort the light poles which is n.log.n time and then we need to loop through each light
pole which is O(n) time. With n.log.n being the major operation here we can neglect the second operation which is O(n) leaving our time complexity
to be O(n.log.n).