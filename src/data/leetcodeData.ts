export interface LeetCodeProblem {
  id: number;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
}

export const leetcodeProblems: LeetCodeProblem[] = [
  // 1. Arrays & Hashing
  { id: 1, title: "Two Sum", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
  { id: 2, title: "Contains Duplicate", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
  { id: 3, title: "Valid Anagram", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
  { id: 4, title: "Group Anagrams", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
  { id: 5, title: "Top K Frequent Elements", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: 6, title: "Product of Array Except Self", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: 7, title: "Longest Consecutive Sequence", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },

  // 2. Two Pointers
  { id: 8, title: "Valid Palindrome", topic: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 9, title: "3Sum", topic: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
  { id: 10, title: "Container With Most Water", topic: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 11, title: "Trapping Rain Water", topic: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },

  // 3. Sliding Window
  { id: 12, title: "Best Time to Buy and Sell Stock", topic: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: 13, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 14, title: "Longest Repeating Character Replacement", topic: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: 15, title: "Minimum Window Substring", topic: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },

  // 4. Stacks & Queues
  { id: 16, title: "Valid Parentheses", topic: "Stacks & Queues", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 17, title: "Min Stack", topic: "Stacks & Queues", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
  { id: 18, title: "Evaluate Reverse Polish Notation", topic: "Stacks & Queues", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: 19, title: "Daily Temperatures", topic: "Stacks & Queues", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },

  // 5. Binary Search
  { id: 20, title: "Binary Search", topic: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
  { id: 21, title: "Search a 2D Matrix", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: 22, title: "Find Minimum in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: 23, title: "Search in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },

  // 6. Linked Lists
  { id: 24, title: "Reverse Linked List", topic: "Linked Lists", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 25, title: "Merge Two Sorted Lists", topic: "Linked Lists", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 26, title: "Reorder List", topic: "Linked Lists", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
  { id: 27, title: "Remove Nth Node From End of List", topic: "Linked Lists", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: 28, title: "Linked List Cycle", topic: "Linked Lists", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: 29, title: "Merge K Sorted Lists", topic: "Linked Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },

  // 7. Trees
  { id: 30, title: "Invert Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 31, title: "Maximum Depth of Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 32, title: "Same Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
  { id: 33, title: "Subtree of Another Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
  { id: 34, title: "Lowest Common Ancestor of a BST", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: 35, title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 36, title: "Validate Binary Search Tree", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: 37, title: "Kth Smallest Element in a BST", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: 38, title: "Construct Binary Tree from Preorder and Inorder", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: 39, title: "Binary Tree Maximum Path Sum", topic: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: 40, title: "Serialize and Deserialize Binary Tree", topic: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // 8. Heaps & Priority Queues
  { id: 41, title: "Kth Largest Element in a Stream", topic: "Heaps", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: 42, title: "Last Stone Weight", topic: "Heaps", difficulty: "Easy", url: "https://leetcode.com/problems/last-stone-weight/" },
  { id: 43, title: "K Closest Points to Origin", topic: "Heaps", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: 44, title: "Find Median from Data Stream", topic: "Heaps", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },

  // 9. Backtracking
  { id: 45, title: "Subsets", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
  { id: 46, title: "Combination Sum", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
  { id: 47, title: "Permutations", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
  { id: 48, title: "Word Search", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },

  // 10. Graphs
  { id: 49, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
  { id: 50, title: "Clone Graph", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
  { id: 51, title: "Pacific Atlantic Water Flow", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: 52, title: "Course Schedule", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
  { id: 53, title: "Graph Valid Tree", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: 54, title: "Number of Connected Components", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },

  // 11. Dynamic Programming
  { id: 55, title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 56, title: "Cost Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id: 57, title: "House Robber", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/" },
  { id: 58, title: "House Robber II", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/" },
  { id: 59, title: "Longest Palindromic Substring", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: 60, title: "Palindromic Substrings", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: 61, title: "Decode Ways", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/" },
  { id: 62, title: "Coin Change", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
  { id: 63, title: "Maximum Product Subarray", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: 64, title: "Word Break", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/" },
  { id: 65, title: "Longest Increasing Subsequence", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: 66, title: "Unique Paths", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/" },
  { id: 67, title: "Longest Common Subsequence", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },

  // 12. Greedy Algorithms
  { id: 68, title: "Maximum Subarray", topic: "Greedy Algorithms", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" },
  { id: 69, title: "Jump Game", topic: "Greedy Algorithms", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" },
  { id: 70, title: "Jump Game II", topic: "Greedy Algorithms", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/" },
  { id: 71, title: "Gas Station", topic: "Greedy Algorithms", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },

  // 13. Bit Manipulation
  { id: 72, title: "Single Number", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/" },
  { id: 73, title: "Number of 1 Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: 74, title: "Counting Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/" },
  { id: 75, title: "Reverse Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-bits/" },
  { id: 76, title: "Missing Number", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
  { id: 77, title: "Sum of Two Integers", topic: "Bit Manipulation", difficulty: "Medium", url: "https://leetcode.com/problems/sum-of-two-integers/" },
];
