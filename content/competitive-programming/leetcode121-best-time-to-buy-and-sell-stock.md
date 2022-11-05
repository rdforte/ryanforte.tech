+++
"competitive-programming" = ["show-all", "other"]
date = "2022-11-06T09:42:55+11:00"
draft = false
title = "Leetcode121 Best Time to Buy and Sell Stock"
difficulty = "easy"
platform = "leetcode"
+++

[Leetcode question 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)

When doing this question or any sort of question it usually helps to visualize what is happening.

So therefore given a list of numbers __[7, 1, 5, 3, 6, 4]__ lets go and plot these on a graph.

![graph](/competitive-programming/images/leetcode121-best-time-to-buy-and-sell-stock/graph.png)

Looking at this graph we can see that in order to maximize our profit we must

1. Buy at the low
2. Sell at the high

![profit](/competitive-programming/images/leetcode121-best-time-to-buy-and-sell-stock/profit.png)

Based on the above graph I would like to know what is the __lowest price__ I can buy at plus if I were to buy
at this price what would be my __maximum profit__.

### Solution

```cpp
#include <bits/stdc++.h>

using namespace std;

int maxProfit(vector<int> &prices)
{
  int profit = 0;
  int buy = prices[0];

  for (auto p : prices)
  {
    profit = max(profit, p - buy);
    buy = min(buy, p);
  }

  return profit;
}
```

### Space and Time Complexity
- __Space Complexity__: O(1) because we just keep track of the max profit and the min buy.
- __Time Complexity__: O(n) because we loop through all the prices once.