+++
"competitive-programming" = ["show-all", "sliding-window"]
date = "2023-08-02T11:18:15+10:00"
draft = false
title = "Leetcode424 Longest Repeating Character Replacement"
difficulty = "medium"
platform = "leetcode"
+++

[Leetcode question 424](https://leetcode.com/problems/longest-repeating-character-replacement/description/)

This question here had my brain 🤯 so don't stress if you can't get it first time round.
Hopefully in this short article I can help break down my though process and how you might go about
tackling this question.

### Approach

So we are given a string of **uppercase letters**, and we are told that we need to find the longest substring
with the same **repeating characters**. We can swap out any characters **k** number of times to help
us get the longest repeating substring.

Let's use the example provided to us in the question because I feel like it's a good one.

```text
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
The substring "BBBB" has the longest repeating letters, which is 4.
There may exists other ways to achieve this answer too.
```

So you can see in the above example we can replace the characters **A** with **B** at index's 3 and 6 to get the longest
substring of **BBBB** or the characters **B** at index's 2 and 4 to get **AAAA**.

The thing is how do we know whether to swap an A for a B or a B for an A because what if we had the below?

```text
Input: s = "ABBB", k = 1
Output: 4
```

Well if we just decided to swap the B's for A's we would get a max length of 2. But if we decided to swap the A for a B we
would get a max length of 4. So 4 would be our correct answer here. Hmmmm ok 🤔

Maybe lets really try and dum this down. What if I asked you to work out the number of times we saw the letter A in the below
string?

```text
Input: s = "AABA"
```

You would probably iterate over the string keeping a count of how many times A appeared. Something like this maybe?

```cpp
    string s = "AAAA";
    int count = 0;

    for (int i = 0; i < s.length(); i++) {
        if (s[i] == 'A') {
            count++;
        }
    }
    cout << count;
```

This would give me an output of 3.
So now what if I asked you to tell me how many characters you would need to swap in order to make this all A's?

```text
length of string - number of A's

= 1
```

Now this is kind of similar to our question right? As we move through the string we can tally the number of times we see
a particular letter keeping track of the max repeated character. Always checking to see the difference between the length of the
string and the max repeated characters. Because this would give us the number of characters we would need to change in order
for every character to be the same.

For example using the string "AABABBA" with k = 2:

### Letter A------
![step 1](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/1.png)
Starting with both our pointers at letter A. We keep track of how many times we have seen the letter A.
We know that our string length is 1, and we have only used 1 letter A so **stringLength - 1 = 0**. Resulting in 0 total swaps.

### Letter AA-----
![step 2](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/2.png)
Moving our right pointer to the next character we can see that we have now seen a total of 2 A's. With the string length
being 2 and 2 A's **stringLength - 2 = 0**. Our total swaps can still be 0.

### Letter AAB----
![step 3](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/3.png)
We move our right pointer 1 place to the right and we encounter the character B. Ok now do we subtract the total A's from the string
length or the total B's? We want to minimise the number of swaps so lets get the max of A and B and use that.
**stringLength - 2 = 1**. This leaves us with 1 total swap. 

### Letter AABA---
![step 4](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/4.png)
Repeating the above steps we increment the count for A and do our subtraction from the length using the max. In this case
**stringLength - 3 = 1**. Still only 1 swap.

### Letter AABAB--
![step 5](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/5.png)
We now encounter another character B. This leaves us with a total of 2 B's seen and 3 A's seen. The max is still 3.
The total swaps now would be **stringLength - 3 = 2**, giving us a total of 2 swaps.

### Letter AABABB-
![step 6](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/6.png)
We encounter another B leaving us with 3 B's and 3 A's. The total swaps now is **stringLength - 3 = 3**. Oops we have
now exceeded **k**, so we will need to bring in our string length.

### Letter -ABABB-
![step 7](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/7.png)
We move the left pointer forward one, shortening the string and decrementing A. We do this because we have seen all the
substrings between the range of index 0 through to 6. So now we need to see if we can find a new greater range starting at
index 1.

### Letter -ABABBB
![step 8](/competitive-programming/images/leetcode424-longest-repeating-character-replacement/8.png)
We move the Right pointer forward. Calculating the max character length and finding number of swaps. We have exceeded k and are at
the end of our loop.

You can see that each time we do not exceed k we have our maximum string length. This will be our Answer.

### Solution

```cpp
class Solution {
public:
    static int characterReplacement(string s, int k) {
        int longest = 0;
        vector<int> chars(26, 0);
        int maxUnchangedNums = 1;

        for (int l = 0, r = 0; r < s.length(); r++) {
            chars[s[r] - 'A']++;

            int len = r + 1 - l;
            maxUnchangedNums = max(chars[s[r] - 'A'], maxUnchangedNums);
            int changesLeft = len - maxUnchangedNums;

            if (changesLeft > k) {
                chars[s[l] - 'A']--;
                l++;
            } else {
                longest++;
            }
        }

        return longest;
    }
};
```

### Space and Time Complexity
- __Space Complexity__: O(n): We could potentially keep track of all capital letters in the string.
- __Time Complexity__: O(n): The right pointer moves 1 place on every iteration of the loop all the way up until the last character.


