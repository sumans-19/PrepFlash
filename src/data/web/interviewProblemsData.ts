export interface InterviewProblem {
    id: string;
    title: string;
    description: string;
    company: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    instructions: string[];
    defaultCode: string;
  }
  
  export const interviewProblems: InterviewProblem[] = [
    {
      id: "interview-1",
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target value",
      company: "Google",
      difficulty: "Easy",
      instructions: [
        "Given an array of integers nums and an integer target",
        "Return indices of the two numbers such that they add up to target",
        "You may assume that each input would have exactly one solution",
        "You may not use the same element twice"
      ],
      defaultCode: `function twoSum(nums, target) {
    // Your solution here
    
    return []; // Return indices of the two numbers
  }
  
  // Example:
  // Input: nums = [2,7,11,15], target = 9
  // Output: [0,1] (because nums[0] + nums[1] == 9)
  console.log(twoSum([2,7,11,15], 9));`
    },
    {
      id: "interview-2",
      title: "Valid Parentheses",
      description: "Determine if a string of parentheses is valid",
      company: "Amazon",
      difficulty: "Easy",
      instructions: [
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']'",
        "Determine if the input string is valid",
        "An input string is valid if:",
        "Open brackets must be closed by the same type of brackets",
        "Open brackets must be closed in the correct order"
      ],
      defaultCode: `function isValid(s) {
    // Your solution here
    
    return true; // Return boolean indicating if string is valid
  }
  
  // Example:
  // Input: s = "()[]{}"
  // Output: true
  console.log(isValid("()[]{}")); // true
  console.log(isValid("(]")); // false`
    },
    {
      id: "interview-3",
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum",
      company: "Microsoft",
      difficulty: "Medium",
      instructions: [
        "Given an integer array nums",
        "Find the contiguous subarray which has the largest sum",
        "Return the sum of the subarray"
      ],
      defaultCode: `function maxSubArray(nums) {
    // Your solution here
    
    return 0; // Return the max sum
  }
  
  // Example:
  // Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
  // Output: 6 (from subarray [4,-1,2,1])
  console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`
    },
    {
      id: "interview-4",
      title: "Merge Intervals",
      description: "Merge all overlapping intervals",
      company: "Facebook",
      difficulty: "Medium",
      instructions: [
        "Given an array of intervals where intervals[i] = [starti, endi]",
        "Merge all overlapping intervals",
        "Return an array of the non-overlapping intervals that cover all the intervals in the input"
      ],
      defaultCode: `function merge(intervals) {
    // Your solution here
    
    return []; // Return merged intervals
  }
  
  // Example:
  // Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
  // Output: [[1,6],[8,10],[15,18]]
  console.log(merge([[1,3],[2,6],[8,10],[15,18]]));`
    },
    {
      id: "interview-5",
      title: "LRU Cache",
      description: "Implement a Least Recently Used (LRU) cache",
      company: "Google",
      difficulty: "Hard",
      instructions: [
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache",
        "Implement the LRUCache class with get and put methods",
        "get(key) - Get the value of the key if the key exists in the cache, otherwise return -1",
        "put(key, value) - Set or insert the value if the key is not already present",
        "When the cache reaches its capacity, it should invalidate the least recently used item"
      ],
      defaultCode: `class LRUCache {
    constructor(capacity) {
      // Initialize your data structure here
    }
    
    get(key) {
      // Return the value of the key if it exists, otherwise return -1
    }
    
    put(key, value) {
      // Update the value of the key if it exists
      // Otherwise, add the key-value pair to the cache
      // If the number of keys exceeds capacity, evict the least recently used key
    }
  }
  
  // Example usage:
  const lRUCache = new LRUCache(2);
  lRUCache.put(1, 1); // cache is {1=1}
  lRUCache.put(2, 2); // cache is {1=1, 2=2}
  console.log(lRUCache.get(1));    // return 1
  lRUCache.put(3, 3); // LRU key was 2, cache is {1=1, 3=3}
  console.log(lRUCache.get(2));    // returns -1 (not found)
  lRUCache.put(4, 4); // LRU key was 1, cache is {4=4, 3=3}
  console.log(lRUCache.get(1));    // return -1 (not found)
  console.log(lRUCache.get(3));    // return 3
  console.log(lRUCache.get(4));    // return 4`
    },
    {
      id: "interview-6",
      title: "Trapping Rain Water",
      description: "Calculate how much water can be trapped after raining",
      company: "Amazon",
      difficulty: "Hard",
      instructions: [
        "Given n non-negative integers representing an elevation map",
        "Each element represents the height of a bar with width 1",
        "Compute how much water it can trap after raining"
      ],
      defaultCode: `function trap(height) {
    // Your solution here
    
    return 0; // Return the amount of trapped water
  }
  
  // Example:
  // Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
  // Output: 6
  console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`
    },
    {
      id: "interview-7",
      title: "Remove Nth Node From End of List",
      description: "Remove the nth node from the end of a linked list",
      company: "Microsoft",
      difficulty: "Medium",
      instructions: [
        "Given the head of a linked list",
        "Remove the nth node from the end of the list and return its head",
        "A ListNode class is provided for you"
      ],
      defaultCode: `// Definition for singly-linked list.
  function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
  
  function removeNthFromEnd(head, n) {
    // Your solution here
    
    return head; // Return the modified list
  }
  
  // Helper function to create a linked list from an array
  function createLinkedList(arr) {
    if (!arr.length) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }
    return head;
  }
  
  // Helper function to convert linked list to array for display
  function linkedListToArray(head) {
    const result = [];
    let current = head;
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }
  
  // Example:
  // Input: head = [1,2,3,4,5], n = 2
  // Output: [1,2,3,5]
  const list = createLinkedList([1,2,3,4,5]);
  const result = removeNthFromEnd(list, 2);
  console.log(linkedListToArray(result)); // [1,2,3,5]`
    },
    {
      id: "interview-8",
      title: "Design Twitter",
      description: "Design a simplified version of Twitter",
      company: "Facebook",
      difficulty: "Hard",
      instructions: [
        "Design a simplified version of Twitter where users can post tweets, follow other users",
        "Users should be able to see the 10 most recent tweets in their news feed",
        "Implement the Twitter class with the following methods:",
        "postTweet(userId, tweetId) - Compose a new tweet",
        "getNewsFeed(userId) - Retrieve the 10 most recent tweet IDs in the user's news feed",
        "follow(followerId, followeeId) - Follower follows a followee",
        "unfollow(followerId, followeeId) - Follower unfollows a followee"
      ],
      defaultCode: `class Twitter {
    constructor() {
      // Initialize your data structure here
    }
    
    postTweet(userId, tweetId) {
      // Compose a new tweet
    }
    
    getNewsFeed(userId) {
      // Retrieve the 10 most recent tweet IDs in the user's news feed
      // A user's news feed consists of the 10 most recent tweets
      // from all the people they follow, including their own tweets
      
      return []; // Return a list of tweet IDs
    }
    
    follow(followerId, followeeId) {
      // Follower follows a followee
    }
    
    unfollow(followerId, followeeId) {
      // Follower unfollows a followee
    }
  }
  
  // Example usage:
  const twitter = new Twitter();
  twitter.postTweet(1, 5); // User 1 posts a new tweet (id = 5)
  console.log(twitter.getNewsFeed(1));  // User 1's news feed should return [5]
  twitter.follow(1, 2);    // User 1 follows user 2
  twitter.postTweet(2, 6); // User 2 posts a new tweet (id = 6)
  console.log(twitter.getNewsFeed(1));  // User 1's news feed should return [6, 5]
  twitter.unfollow(1, 2);  // User 1 unfollows user 2
  console.log(twitter.getNewsFeed(1));  // User 1's news feed should return [5]`
    },
    {
      id: "interview-9",
      title: "Course Schedule",
      description: "Determine if it's possible to finish all courses",
      company: "Google",
      difficulty: "Medium",
      instructions: [
        "There are a total of numCourses courses labeled from 0 to numCourses - 1",
        "Some courses have prerequisites: for example, to take course 0 you have to first take course 1",
        "This is expressed as a pair [0, 1]",
        "Given numCourses and prerequisites, return true if you can finish all courses, otherwise return false"
      ],
      defaultCode: `function canFinish(numCourses, prerequisites) {
    // Your solution here
    
    return true; // Return boolean indicating if all courses can be finished
  }
  
  // Example:
  // Input: numCourses = 2, prerequisites = [[1,0]]
  // Output: true (To take course 1 you should have finished course 0. So it's possible)
  console.log(canFinish(2, [[1,0]])); // true
  
  // Example:
  // Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
  // Output: false (To take course 1 you should have finished course 0, and to take course 0 you should have finished course 1. This is impossible)
  console.log(canFinish(2, [[1,0],[0,1]])); // false`
    },
    {
      id: "interview-10",
      title: "Word Break",
      description: "Determine if a string can be segmented into words",
      company: "Amazon",
      difficulty: "Medium",
      instructions: [
        "Given a string s and a dictionary of strings wordDict",
        "Return true if s can be segmented into a space-separated sequence of one or more dictionary words",
        "Note that the same word in the dictionary may be reused multiple times in the segmentation"
      ],
      defaultCode: `function wordBreak(s, wordDict) {
    // Your solution here
    
    return false; // Return boolean indicating if the string can be segmented
  }
  
  // Example 1:
  // Input: s = "leetcode", wordDict = ["leet", "code"]
  // Output: true (Return true because "leetcode" can be segmented as "leet code")
  console.log(wordBreak("leetcode", ["leet", "code"])); // true
  
  // Example 2:
  // Input: s = "applepenapple", wordDict = ["apple", "pen"]
  // Output: true (Return true because "applepenapple" can be segmented as "apple pen apple")
  console.log(wordBreak("applepenapple", ["apple", "pen"])); // true
  
  // Example 3:
  // Input: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
  // Output: false
  console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false`
    }
  ];
  