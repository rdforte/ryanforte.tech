+++
"competitive-programming" = ["show-all", "dfs", "graph"]
date = "2022-10-29T08:14:52+11:00"
draft = false
title = "Leetcode733 Flood Fill"
difficulty = "easy"
platform = "leetcode"
+++

[LeetCode question 733](https://leetcode.com/problems/flood-fill/)

This question is quite a popular Google interview question and it is not a tricky one if you can visualize what
is happening.

So lets just recap quickly what we are expected to do here. We have an __m * n__ grid where each cell on the grid is
an integer and are job is to perform a __flood fill__ whereby we convert neighboring cells to the integer which is provided
to us.

A Flood fill is an algorithm mainly used to determine a bounded area connected to a given node in a multi-dimensional array.

We must perform the flood fill from the starting cell through to all cells which are connected __4 directionally__ (up, down, left, right)
and are the same integer as the source.

This may look something like the below.


- convert all cells with the number 1 to the number 8

![flood fill graph](/competitive-programming/images/leetcode733-flood-fill/graph.png)

If we treat each cell as a vertex/node and we know that each node is connected 4 directionally then we can represent our
grid like this.


![graph representation](/competitive-programming/images/leetcode733-flood-fill/graph-representation.png)

Now does this not look like a graph? where each cell is the node and the 4 directional up, down, left, right represent
the edges connecting each node.

### Approach

There are two ways in which we can tackle this problem and that is either using __DFS (Depth First Search)__ or __BFS (Breadth First Search)__.
Both are graph traversal algorithms.
I will go with using DFS for this approach.

In order to implement DFS we must use a stack. In C++ we can utilize the stack data structure or we can utilize the call stack through
recursion. For my solution I have gone with the later.

Using Recursion we need to make sure we have our base case.

1. if we move up, down, left, right in our graph are we still within the bounds of our graph? if not return
2. is the color of the node we are changing match the same color as the source? if not return

Once we have our base cases set up then traversing through the graph using DFS will look something like this

![dfs traversal](/competitive-programming/images/leetcode733-flood-fill/traversal.png)

### Solution

```cpp
vector<vector<int>> floodFill(vector<vector<int>> &image, int sr, int sc, int color)
{
    if (image[sr][sc] == color)
        return image;

    dfs(image, sr, sc, color, image[sr][sc]);

    return image;
}

void dfs(vector<vector<int>> &image, int sr, int sc, int newColor, int nodeColor)
{
    if (sr >= image.size() || sr < 0 || sc >= image[image.size() - 1].size() || sc < 0)
        return;

    if (image[sr][sc] != nodeColor)
        return;

    image[sr][sc] = newColor;

    dfs(image, sr, sc - 1, newColor, nodeColor);
    dfs(image, sr - 1, sc, newColor, nodeColor);
    dfs(image, sr, sc + 1, newColor, nodeColor);
    dfs(image, sr + 1, sc, newColor, nodeColor);
}
```

### Space and Time Complexity
- __Time Complexity__: O(n) where n is the pixels in the image we are processing / number of nodes.
- __Space Complexity__: O(n) when using dfs the call stack can grow to n nodes deep.