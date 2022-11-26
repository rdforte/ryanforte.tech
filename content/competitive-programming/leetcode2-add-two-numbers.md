+++
"competitive-programming" = ["show-all", "linked-list", "math"]
date = "2022-11-27T07:30:49+11:00"
draft = false
title = "Leetcode2 Add Two Numbers"
difficulty = "medium"
platform = "leetcode"
+++

[Leetcode question 2](https://leetcode.com/problems/add-two-numbers/)

To start this question off we are given __2__ numbers with each number being represented by a __Linked List__.
Each node within the Linked List represents a single digit in the number and each Linked List stores its
values in reverse order.

Our job is to take each Linked List and their corresponding numbers and add them together. For example if we are given
the below Linked Lists.

![example-question](/competitive-programming/images/leetcode2-add-two-numbers/example-question.png)

We take the corresponding nodes values and add them together. Essentially what we are doing is the following:

__342 + 465 = 807__

__NOTE:__ our solution must also be represented as a Linked List.

### Approach

It is usually best to try and break a question down so lets start by doing just that!
If we take the numbers __9 + 9__ lets try and see how we might represent this visually.

![step 1](/competitive-programming/images/leetcode2-add-two-numbers/nine-plus-nine-step1.png)

If we add 9 and 9 together we get 18. So what we can then do is leave the __8__ in the __1's column__ and carry the __1__ to the __10's
column__.

![step 2](/competitive-programming/images/leetcode2-add-two-numbers/nine-plus-nine-step2.png)

Now that we have our __1__ in the 10's column we must make sure that our previous node of __8__ is then linked to our __1__ node.

![step 3](/competitive-programming/images/leetcode2-add-two-numbers/nine-plus-nine-step3.png)

We now have our answer of 18 👏

If we think about it, essentially we could repeat the above steps __while__ we have nodes in our Linked Lists or if we have to carry
a number over to the next column.

### Solution

```cpp
#include <bits/stdc++.h>

using namespace std;

struct ListNode
{
  int val;
  ListNode *next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode *addTwoNumbers(ListNode *l1, ListNode *l2)
{
  ListNode *startNode = new ListNode();
  ListNode *nextNode = startNode;
  while (nextNode != nullptr)
  {
    int l1Val = l1 ? l1->val : 0;
    int l2Val = l2 ? l2->val : 0;

    int sum = l1Val + l2Val + nextNode->val;
    int rem = sum % 10;
    nextNode->val = rem;
    int carryToNext = sum - rem;

    if ((l1 and l1->next) or (l2 and l2->next) or (carryToNext) >= 10)
    {
      ListNode *next = new ListNode(carryToNext / 10);
      nextNode->next = next;
    }
    nextNode = nextNode->next;

    if (l1)
      l1 = l1->next;
    if (l2)
      l2 = l2->next;
  }

  return startNode;
}
```

### Space and Time Complexity
- __Space Complexity__: O(max(m, n)) where m and n represent the Linked Lists because our answer will be a Linked List of length ~ max(m, n).
- __Time Complexity__: O(max(m, n)) where m and n represent the Linked Lists because the number of iterations we perform will be ~ max(m, n).