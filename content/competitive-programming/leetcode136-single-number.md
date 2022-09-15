+++
"competitive-programming" = ["show-all", "bit-manipulation"]
date = "2022-09-12T08:03:10+10:00"
draft = false
title = "Leetcode136 Single Number"
difficulty = "easy"
platform = "leetcode"
+++

[Leetcode question 136](https://leetcode.com/problems/single-number/)

This question is very similar to [Leetcode question 268 missing number](/competitive-programming/leetcode268-missing-number)

We can utilize the Bitwise **XOR** operator **^**

### XOR ^

The Bitwise XOR operator will return true / 1 if the bits are different.

![xor image](/competitive-programming/images/leetcode136-single-number/xor.png)

So what if we used XOR on the same number?

![xor image](/competitive-programming/images/leetcode136-single-number/xor_same.png)

So if we have multiple numbers with every number appearing twice except one. Then we know
all the doubles when we use XOR will equate to 0. So what if we then did 0 XOR the single number?

![xor image](/competitive-programming/images/leetcode136-single-number/xor_zero.png)

Therefore
```
4 ^ 1 ^ 2 ^ 1 ^ 2 =

4 ^ (1 ^ 1) ^ (2 ^ 2) =

4 ^ 0 ^ 0 =

4
```

### Space Time Complexity
- **Time** O(n) because we only do xor n times.
- **Space** O(1) because we only have to keep track of the single number.

### Solution

```cpp
class Solution
{
public:
  int singleNumber(vector<int> &nums)
  {
    int singleNum = nums[0];

    for (int i = 1; i < nums.size(); i++)
      singleNum ^= nums[i];

    return singleNum;
  }
};
```
