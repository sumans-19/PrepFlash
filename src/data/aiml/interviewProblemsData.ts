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
    id: "aiml-1",
    title: "K-Nearest Neighbors",
    description: "Implement a simple KNN algorithm for classification",
    company: "Meta",
    difficulty: "Easy",
    instructions: [
      "Given a training dataset with labeled points and a query point",
      "Implement the K-Nearest Neighbors algorithm to classify the query point",
      "Use Euclidean distance to find the nearest neighbors"
    ],
    defaultCode: `function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

function knnClassify(trainData, trainLabels, queryPoint, k) {
  // Your solution here

  return null; // Return predicted class
}

// Example:
const data = [[1,2], [2,3], [3,3], [6,5], [7,7]];
const labels = ['A', 'A', 'A', 'B', 'B'];
console.log(knnClassify(data, labels, [5,5], 3)); // Output should be 'B' or 'A' depending on nearest neighbors`
  },
  {
    id: "aiml-2",
    title: "Naive Bayes Classifier",
    description: "Build a basic Naive Bayes classifier for binary text classification",
    company: "Google",
    difficulty: "Medium",
    instructions: [
      "Implement a Naive Bayes classifier to classify a set of text documents",
      "Assume binary classification and use bag-of-words model",
      "Use Laplace smoothing to avoid zero probabilities"
    ],
    defaultCode: `function trainNaiveBayes(docs, labels) {
  // Your solution here

  return { priors: {}, likelihoods: {} }; // Return model
}

function predictNaiveBayes(model, doc) {
  // Your solution here

  return null; // Return predicted class
}

// Example:
const docs = ["buy cheap meds", "cheap meds online", "hello friend", "how are you"];
const labels = [1, 1, 0, 0];
const model = trainNaiveBayes(docs, labels);
console.log(predictNaiveBayes(model, "cheap meds")); // Output: 1 (spam)`
  },
  {
    id: "aiml-3",
    title: "Linear Regression",
    description: "Implement simple linear regression using gradient descent",
    company: "Apple",
    difficulty: "Medium",
    instructions: [
      "Implement linear regression with one feature",
      "Use gradient descent to optimize the weights",
      "Return the predicted value for a given input"
    ],
    defaultCode: `function linearRegression(X, y, learningRate = 0.01, epochs = 1000) {
  let m = 0, b = 0;
  for (let i = 0; i < epochs; i++) {
    let mGrad = 0, bGrad = 0;
    for (let j = 0; j < X.length; j++) {
      const pred = m * X[j] + b;
      const error = pred - y[j];
      mGrad += error * X[j];
      bGrad += error;
    }
    m -= learningRate * mGrad / X.length;
    b -= learningRate * bGrad / X.length;
  }
  return function(x) {
    return m * x + b;
  };
}

// Example:
const X = [1, 2, 3, 4];
const y = [2, 4, 6, 8];
const model = linearRegression(X, y);
console.log(model(5)); // Output close to 10`
  },
  {
    id: "aiml-4",
    title: "Decision Tree Classifier",
    description: "Build a decision tree classifier using information gain",
    company: "Amazon",
    difficulty: "Hard",
    instructions: [
      "Implement a decision tree classifier for categorical data",
      "Use information gain based on entropy to split the data",
      "Build the tree recursively"
    ],
    defaultCode: `function entropy(labels) {
  const counts = {};
  labels.forEach(l => counts[l] = (counts[l] || 0) + 1);
  return -Object.values(counts).reduce((acc, c) => {
    const p = c / labels.length;
    return acc + p * Math.log2(p);
  }, 0);
}

function buildTree(data, labels) {
  // Your solution here

  return {}; // Return tree object
}

function predict(tree, sample) {
  // Your solution here

  return null; // Return predicted class
}

// Example:
const data = [
  { outlook: "sunny", temp: "hot" },
  { outlook: "sunny", temp: "cool" },
  { outlook: "rainy", temp: "cool" }
];
const labels = ["no", "yes", "yes"];
const tree = buildTree(data, labels);
console.log(predict(tree, { outlook: "sunny", temp: "hot" })); // Output: "no" or "yes"`
  },
  {
    id: "aiml-5",
    title: "Support Vector Machine (SVM) - Linear Kernel",
    description: "Implement a basic linear SVM classifier using hinge loss and gradient descent",
    company: "Nvidia",
    difficulty: "Hard",
    instructions: [
      "Use hinge loss for binary classification with labels -1 and +1",
      "Update weights using gradient descent",
      "Return the trained weight vector and bias term"
    ],
    defaultCode: `function svmTrain(X, y, learningRate = 0.001, lambda = 0.01, epochs = 1000) {
    let w = Array(X[0].length).fill(0);
    let b = 0;
  
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < X.length; i++) {
        const margin = y[i] * (dot(w, X[i]) + b);
        if (margin >= 1) {
          w = w.map((wi, j) => wi - learningRate * (2 * lambda * wi));
        } else {
          w = w.map((wi, j) => wi - learningRate * (2 * lambda * wi - y[i] * X[i][j]));
          b += learningRate * y[i];
        }
      }
    }
  
    return { w, b };
  }
  
  function dot(a, b) {
    return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  }
  
  function svmPredict(model, x) {
    return dot(model.w, x) + model.b >= 0 ? 1 : -1;
  }
  
  // Example:
  const X = [[2,3], [1,1], [2,0], [0,2]];
  const y = [1, 1, -1, -1];
  const model = svmTrain(X, y);
  console.log(svmPredict(model, [1,2])); // Output: 1 or -1
  `
  },
  {
    id: "aiml-6",
    title: "Principal Component Analysis (PCA)",
    description: "Perform PCA to reduce data to k dimensions",
    company: "Intel",
    difficulty: "Medium",
    instructions: [
      "Center the data by subtracting the mean",
      "Compute the covariance matrix and perform eigen-decomposition",
      "Return the data projected onto the top k eigenvectors"
    ],
    defaultCode: `function meanCenter(X) {
    const means = X[0].map((_, j) => X.reduce((sum, row) => sum + row[j], 0) / X.length);
    return X.map(row => row.map((val, j) => val - means[j]));
  }
  
  function pca(X, k) {
    // Assume a library provides 'numeric' with SVD or eigen decomposition
    const centered = meanCenter(X);
  
    // Example using SVD
    const covMatrix = numeric.dot(numeric.transpose(centered), centered);
    const eig = numeric.eig(covMatrix);
    const sortedIndices = eig.lambda.x.map((val, i) => [val, i])
      .sort((a, b) => b[0] - a[0])
      .map(pair => pair[1]);
    
    const topK = sortedIndices.slice(0, k);
    const projectionMatrix = topK.map(i => eig.E.x.map(row => row[i]));
    const projected = numeric.dot(centered, numeric.transpose(projectionMatrix));
    
    return projected;
  }
  
  // Example:
  const data = [[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2]];
  console.log(pca(data, 1)); // Output: Projected data in 1D
  `
  },{
    id: "aiml-7",
    title: "Neural Network Forward Propagation",
    description: "Implement the forward propagation step of a simple neural network",
    company: "Tesla",
    difficulty: "Hard",
    instructions: [
      "Given an input array, weights matrix, and biases vector, implement the forward propagation step of a neural network",
      "Return the output of the network for a single input example"
    ],
    defaultCode: `function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  function forwardPropagation(X, weights, biases) {
    const Z = X.map((x, i) => 
      weights[i].reduce((sum, w, j) => sum + w * x[j], 0) + biases[i]
    );
    const A = Z.map(sigmoid);
    return A;
  }
  
  // Example:
  const X = [1, 0];  // Input vector (e.g., feature values)
  const weights = [
    [0.5, 0.2],
    [0.3, 0.8]
  ];  // Weights matrix
  const biases = [0.1, 0.2];  // Biases vector
  console.log(forwardPropagation(X, weights, biases));  // Output: [Sigmoid values]
  `
  },
  {
    id: "aiml-8",
    title: "K-Means Clustering",
    description: "Implement the K-Means clustering algorithm to partition data into k clusters",
    company: "Uber",
    difficulty: "Medium",
    instructions: [
      "Given a set of data points and a specified number of clusters k, partition the data into k clusters",
      "Return the cluster assignments and centroids after convergence"
    ],
    defaultCode: `function initializeCentroids(X, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
      const randIndex = Math.floor(Math.random() * X.length);
      centroids.push(X[randIndex]);
    }
    return centroids;
  }
  
  function assignClusters(X, centroids) {
    return X.map(x => 
      centroids.map((centroid, i) => 
        Math.pow(x[0] - centroid[0], 2) + Math.pow(x[1] - centroid[1], 2)
      )
      .indexOf(Math.min(...centroids.map((centroid, i) => 
        Math.pow(x[0] - centroid[0], 2) + Math.pow(x[1] - centroid[1], 2)
      )))
    );
  }
  
  function updateCentroids(X, k, assignments) {
    const newCentroids = Array(k).fill().map(() => [0, 0]);
    const counts = Array(k).fill(0);
    for (let i = 0; i < X.length; i++) {
      const cluster = assignments[i];
      newCentroids[cluster][0] += X[i][0];
      newCentroids[cluster][1] += X[i][1];
      counts[cluster]++;
    }
    for (let i = 0; i < k; i++) {
      newCentroids[i][0] /= counts[i];
      newCentroids[i][1] /= counts[i];
    }
    return newCentroids;
  }
  
  function kMeans(X, k, maxIterations = 100) {
    let centroids = initializeCentroids(X, k);
    let assignments = [];
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      assignments = assignClusters(X, centroids);
      const newCentroids = updateCentroids(X, k, assignments);
      if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) break;
      centroids = newCentroids;
    }
    return { centroids, assignments };
  }
  
  // Example:
  const data = [
    [1, 2], [2, 3], [3, 4], [8, 8], [9, 9], [10, 10]
  ];
  const k = 2;
  console.log(kMeans(data, k));
  `
  },{
    id: "aiml-9",
    title: "Backpropagation Algorithm",
    description: "Implement the backpropagation algorithm to train a neural network",
    company: "Google",
    difficulty: "Hard",
    instructions: [
      "Given the training data, target values, and a simple neural network with weights and biases",
      "Implement the backpropagation algorithm to update the weights and biases"
    ],
    defaultCode: `function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  function sigmoidDerivative(x) {
    return x * (1 - x);
  }
  
  function backpropagation(X, y, weights, biases, learningRate = 0.01) {
    const m = X.length;
    
    // Forward propagation
    const Z = X.map((x, i) => 
      weights[i].reduce((sum, w, j) => sum + w * x[j], 0) + biases[i]
    );
    const A = Z.map(sigmoid);
    
    // Backward propagation
    const outputError = A.map((a, i) => a - y[i]);
    const dZ = outputError.map((e, i) => e * sigmoidDerivative(A[i]));
    
    // Update weights and biases
    const dW = dZ.map((dz, i) => X[i].map(x => dz * x));
    const dB = dZ;
    
    for (let i = 0; i < weights.length; i++) {
      weights[i] = weights[i].map((w, j) => w - learningRate * dW[i][j]);
    }
    for (let i = 0; i < biases.length; i++) {
      biases[i] -= learningRate * dB[i];
    }
  
    return { weights, biases };
  }
  
  // Example:
  const X = [[1, 0], [0, 1]];
  const y = [1, 0];
  let weights = [[0.5, 0.2], [0.3, 0.8]];
  let biases = [0.1, 0.2];
  const learningRate = 0.01;
  console.log(backpropagation(X, y, weights, biases, learningRate));
  `
  },
  {
    id: "aiml-10",
    title: "Decision Tree Classification",
    description: "Implement a simple decision tree for classification tasks",
    company: "Amazon",
    difficulty: "Medium",
    instructions: [
      "Given a dataset with features and target labels, implement a simple decision tree for classification",
      "The tree should split based on the feature that maximizes information gain"
    ],
    defaultCode: `function calculateEntropy(data, target) {
    const counts = {};
    data.forEach(item => {
      counts[item[target]] = (counts[item[target]] || 0) + 1;
    });
    const total = data.length;
    return Object.values(counts).reduce((entropy, count) => {
      const p = count / total;
      return entropy - p * Math.log2(p);
    }, 0);
  }
  
  function calculateInformationGain(data, feature, target) {
    const uniqueValues = [...new Set(data.map(item => item[feature]))];
    const totalEntropy = calculateEntropy(data, target);
    const weightedEntropy = uniqueValues.reduce((entropy, value) => {
      const subset = data.filter(item => item[feature] === value);
      return entropy + (subset.length / data.length) * calculateEntropy(subset, target);
    }, 0);
    return totalEntropy - weightedEntropy;
  }
  
  function decisionTree(data, features, target) {
    if (data.every(item => item[target] === data[0][target])) {
      return { label: data[0][target] };
    }
  
    let bestFeature = null;
    let bestGain = -Infinity;
    features.forEach(feature => {
      const gain = calculateInformationGain(data, feature, target);
      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
      }
    });
  
    if (bestFeature === null) {
      return { label: data[0][target] };
    }
  
    const tree = { feature: bestFeature, branches: {} };
    const uniqueValues = [...new Set(data.map(item => item[bestFeature]))];
    uniqueValues.forEach(value => {
      const subset = data.filter(item => item[bestFeature] === value);
      tree.branches[value] = decisionTree(subset, features.filter(f => f !== bestFeature), target);
    });
  
    return tree;
  }
  
  // Example:
  const data = [
    { age: 25, salary: 50000, label: "no" },
    { age: 30, salary: 60000, label: "yes" },
    { age: 35, salary: 70000, label: "yes" },
    { age: 40, salary: 80000, label: "no" }
  ];
  const features = ["age", "salary"];
  const target = "label";
  console.log(JSON.stringify(decisionTree(data, features, target), null, 2));
  `
  }
  
  
  
];
