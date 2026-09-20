import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.resolve('index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

describe('Static Analysis & Regression Checks on index.html', () => {
  test('HTML file exists and is populated', () => {
    assert.ok(htmlContent.length > 5000, 'index.html should have substantial content');
  });

  test('sleep() function must be defined for async transitions', () => {
    // Regression test for: ReferenceError: sleep is not defined in ArrayModule.deleteIdx
    const hasSleepDef = /function\s+sleep\s*\(|const\s+sleep\s*=|let\s+sleep\s*=/.test(htmlContent);
    assert.ok(hasSleepDef, 'sleep function must be defined in index.html to prevent runtime ReferenceError in deleteIdx');
  });

  test('Animation cancellation engine and executionToken defined', () => {
    // Regression test for animation tab switching and race conditions
    assert.ok(htmlContent.includes('cancelOngoingAnimation'), 'cancelOngoingAnimation must exist');
    assert.ok(htmlContent.includes('executionToken'), 'executionToken must exist');
  });

  test('AudioContext error handling and safe execution', () => {
    assert.ok(htmlContent.includes('AudioContext'), 'AudioContext should be initialized');
    assert.ok(htmlContent.includes('try {'), 'Audio should be wrapped in try/catch for autoplay restrictions');
  });

  test('All 6 data structures are configured with required metadata', () => {
    const requiredDS = ['array', 'linkedlist', 'stack', 'queue', 'bst', 'hashtable'];
    for (const ds of requiredDS) {
      assert.ok(htmlContent.includes(`${ds}: {`), `DS_CONFIG must contain configuration for ${ds}`);
    }
  });

  test('Linked list complexity specifies type: "linear"', () => {
    assert.ok(htmlContent.includes('{ name: "Search", time: "O(n)", type: "linear" }'), 'Linked list Search complexity should have type: "linear"');
  });

  test('Queue config contains peek code snippet', () => {
    assert.ok(htmlContent.includes('peek: ['), 'Queue codeLines must contain peek implementation');
  });

  test('All navigation tab buttons correspond to registered modules', () => {
    const expectedModules = ['array', 'linkedlist', 'stack', 'queue', 'bst', 'hashtable'];
    expectedModules.forEach(mod => {
      assert.ok(htmlContent.includes(`switchDS('${mod}')`), `Navigation must include switchDS for '${mod}'`);
    });
  });

  test('All module objects exist in script', () => {
    const modules = ['ArrayModule', 'LinkedListModule', 'StackModule', 'QueueModule', 'BSTModule', 'HashTableModule'];
    modules.forEach(mod => {
      assert.ok(htmlContent.includes(`const ${mod} =`), `Module ${mod} must be defined`);
    });
  });
});

describe('Unit Tests: Array Operations', () => {
  let arr;
  const MAX_SIZE = 8;

  function insert(val) {
    if (isNaN(val)) throw new Error('Numeric value required');
    if (arr.length >= MAX_SIZE) throw new Error('Buffer limit reached');
    arr.push(val);
    return arr.length - 1;
  }

  function deleteIdx(idx) {
    if (arr.length === 0) throw new Error('Vector buffer is empty');
    if (isNaN(idx) || idx < 0 || idx >= arr.length) throw new Error('Invalid offset');
    return arr.splice(idx, 1)[0];
  }

  function search(val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) return i;
    }
    return -1;
  }

  test('Insert elements within bounds', () => {
    arr = [10, 20, 30];
    const newIdx = insert(40);
    assert.equal(newIdx, 3);
    assert.deepEqual(arr, [10, 20, 30, 40]);
  });

  test('Insert rejects when at max capacity', () => {
    arr = [1, 2, 3, 4, 5, 6, 7, 8];
    assert.throws(() => insert(9), /Buffer limit reached/);
  });

  test('Delete element shifts trailing elements in O(n)', () => {
    arr = [12, 45, 7, 23, 56];
    const removed = deleteIdx(2);
    assert.equal(removed, 7);
    assert.deepEqual(arr, [12, 45, 23, 56]);
  });

  test('Delete invalid offset throws error', () => {
    arr = [10, 20];
    assert.throws(() => deleteIdx(-1), /Invalid offset/);
    assert.throws(() => deleteIdx(5), /Invalid offset/);
  });

  test('Delete on empty array throws empty buffer error', () => {
    arr = [];
    assert.throws(() => deleteIdx(0), /Vector buffer is empty/);
  });

  test('Search locates existing target and returns -1 for missing', () => {
    arr = [12, 45, 7, 23, 56];
    assert.equal(search(23), 3);
    assert.equal(search(999), -1);
  });
});

describe('Unit Tests: Linked List Operations', () => {
  class LLNode {
    constructor(v) { this.val = v; this.next = null; }
  }

  function buildLL(arr) {
    let h = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      let n = new LLNode(arr[i]); n.next = h; h = n;
    }
    return h;
  }

  function toArray(head) {
    const res = [];
    let curr = head;
    while (curr) { res.push(curr.val); curr = curr.next; }
    return res;
  }

  test('buildLL maintains array sequence', () => {
    const head = buildLL([18, 42, 9, 65]);
    assert.deepEqual(toArray(head), [18, 42, 9, 65]);
  });

  test('Insert Head executes in O(1)', () => {
    let head = buildLL([10, 20]);
    const newNode = new LLNode(5);
    newNode.next = head;
    head = newNode;
    assert.deepEqual(toArray(head), [5, 10, 20]);
  });

  test('Insert Tail traverses to end and links node', () => {
    let head = buildLL([10, 20]);
    const newNode = new LLNode(30);
    let curr = head;
    while (curr.next) curr = curr.next;
    curr.next = newNode;
    assert.deepEqual(toArray(head), [10, 20, 30]);
  });

  test('Insert Tail on empty list sets new head', () => {
    let head = null;
    const newNode = new LLNode(42);
    if (!head) head = newNode;
    assert.deepEqual(toArray(head), [42]);
  });

  test('Delete Head on multi-node list unlinks head', () => {
    let head = buildLL([10, 20, 30]);
    const removed = head.val;
    head = head.next;
    assert.equal(removed, 10);
    assert.deepEqual(toArray(head), [20, 30]);
  });

  test('Delete Head down to null', () => {
    let head = buildLL([100]);
    head = head.next;
    assert.equal(head, null);
    assert.deepEqual(toArray(head), []);
  });
});

describe('Unit Tests: Stack Operations (LIFO)', () => {
  let stack;
  const MAX_STACK = 6;

  function push(v) {
    if (stack.length >= MAX_STACK) throw new Error('Stack Overflow');
    stack.push(v);
  }

  function pop() {
    if (stack.length === 0) throw new Error('Stack Underflow');
    return stack.pop();
  }

  function peek() {
    if (stack.length === 0) return null;
    return stack[stack.length - 1];
  }

  test('Push and Pop adhere strictly to LIFO', () => {
    stack = [];
    push(14);
    push(28);
    push(55);
    assert.equal(peek(), 55);
    assert.equal(pop(), 55);
    assert.equal(pop(), 28);
    assert.equal(peek(), 14);
    assert.equal(pop(), 14);
  });

  test('Pop on empty stack throws Stack Underflow', () => {
    stack = [];
    assert.throws(() => pop(), /Stack Underflow/);
  });

  test('Push past capacity throws Stack Overflow', () => {
    stack = [1, 2, 3, 4, 5, 6];
    assert.throws(() => push(7), /Stack Overflow/);
  });
});

describe('Unit Tests: Queue Operations (FIFO)', () => {
  let queue;
  const MAX_QUEUE = 7;

  function enqueue(v) {
    if (queue.length >= MAX_QUEUE) throw new Error('Queue Pipeline Full');
    queue.push(v);
  }

  function dequeue() {
    if (queue.length === 0) throw new Error('Pipeline Depleted');
    return queue.shift();
  }

  function peek() {
    if (queue.length === 0) return null;
    return queue[0];
  }

  test('Enqueue and Dequeue adhere strictly to FIFO', () => {
    queue = [];
    enqueue(15);
    enqueue(33);
    enqueue(72);
    assert.equal(peek(), 15);
    assert.equal(dequeue(), 15);
    assert.equal(dequeue(), 33);
    assert.equal(peek(), 72);
    assert.equal(dequeue(), 72);
    assert.equal(peek(), null);
  });

  test('Dequeue on empty throws Pipeline Depleted', () => {
    queue = [];
    assert.throws(() => dequeue(), /Pipeline Depleted/);
  });

  test('Enqueue past capacity throws Queue Pipeline Full', () => {
    queue = [1, 2, 3, 4, 5, 6, 7];
    assert.throws(() => enqueue(8), /Queue Pipeline Full/);
  });
});

describe('Unit Tests: Binary Search Tree (BST)', () => {
  class BSTNode {
    constructor(v) { this.val = v; this.left = null; this.right = null; }
  }

  function bstInsert(r, v) {
    if (!r) return new BSTNode(v);
    if (v < r.val) r.left = bstInsert(r.left, v);
    else if (v > r.val) r.right = bstInsert(r.right, v);
    return r;
  }

  function buildBST(arr) {
    let r = null;
    arr.forEach(v => { r = bstInsert(r, v); });
    return r;
  }

  function inOrder(node, res = []) {
    if (!node) return res;
    inOrder(node.left, res);
    res.push(node.val);
    inOrder(node.right, res);
    return res;
  }

  function bstSearch(root, target) {
    let curr = root;
    const path = [];
    while (curr) {
      path.push(curr.val);
      if (curr.val === target) return { found: true, path };
      if (target < curr.val) curr = curr.left;
      else curr = curr.right;
    }
    return { found: false, path };
  }

  test('In-order traversal always produces sorted order', () => {
    const root = buildBST([50, 25, 75, 12, 38, 60, 92]);
    const sorted = inOrder(root);
    assert.deepEqual(sorted, [12, 25, 38, 50, 60, 75, 92]);
  });

  test('Skewed trees preserve BST invariant and order', () => {
    const leftSkew = buildBST([70, 50, 40, 30, 20]);
    assert.deepEqual(inOrder(leftSkew), [20, 30, 40, 50, 70]);

    const rightSkew = buildBST([20, 30, 40, 50, 70]);
    assert.deepEqual(inOrder(rightSkew), [20, 30, 40, 50, 70]);
  });

  test('BST Search follows exact binary search path', () => {
    const root = buildBST([50, 25, 75, 12, 38, 60, 92]);
    const result = bstSearch(root, 38);
    assert.equal(result.found, true);
    assert.deepEqual(result.path, [50, 25, 38]);

    const missing = bstSearch(root, 99);
    assert.equal(missing.found, false);
    assert.deepEqual(missing.path, [50, 75, 92]);
  });
});

describe('Unit Tests: Hash Table with Separate Chaining', () => {
  const HT_SIZE = 5;

  function getHash(k) {
    let s = 0;
    for (let c of k) s = (s + c.charCodeAt(0)) % HT_SIZE;
    return s;
  }

  class HashTable {
    constructor() {
      this.buckets = Array.from({ length: HT_SIZE }, () => []);
    }

    set(k, v) {
      const idx = getHash(k);
      const bucket = this.buckets[idx];
      const existing = bucket.find(e => e.k === k);
      if (existing) {
        existing.v = v;
      } else {
        bucket.push({ k, v });
      }
      return idx;
    }

    get(k) {
      const idx = getHash(k);
      const bucket = this.buckets[idx];
      const entry = bucket.find(e => e.k === k);
      return entry ? entry.v : null;
    }

    delete(k) {
      const idx = getHash(k);
      const bucket = this.buckets[idx];
      const before = bucket.length;
      this.buckets[idx] = bucket.filter(e => e.k !== k);
      return this.buckets[idx].length < before;
    }
  }

  test('Hash function outputs valid bucket indexes [0..4]', () => {
    const testKeys = ['alpha', 'beta', 'gamma', 'cat', 'act', 'tac', '12345'];
    testKeys.forEach(k => {
      const h = getHash(k);
      assert.ok(h >= 0 && h < HT_SIZE, `Hash ${h} must be within 0..${HT_SIZE - 1}`);
    });
  });

  test('Handles key insertions, updates, and separate chaining collisions', () => {
    const ht = new HashTable();
    // 'cat', 'act', 'tac' are anagrams => same hash bucket (collision)
    const h1 = ht.set('cat', 'feline');
    const h2 = ht.set('act', 'action');
    const h3 = ht.set('tac', 'toe');

    assert.equal(h1, h2);
    assert.equal(h2, h3);
    assert.equal(ht.buckets[h1].length, 3, 'Bucket must chain 3 items due to collision');

    assert.equal(ht.get('cat'), 'feline');
    assert.equal(ht.get('act'), 'action');
    assert.equal(ht.get('tac'), 'toe');
  });

  test('Updates existing key in-place without duplicating', () => {
    const ht = new HashTable();
    ht.set('user', 'guest');
    ht.set('user', 'admin');
    assert.equal(ht.get('user'), 'admin');
    const bucket = ht.buckets[getHash('user')];
    assert.equal(bucket.filter(e => e.k === 'user').length, 1);
  });

  test('Deletes existing key and returns false for nonexistent key', () => {
    const ht = new HashTable();
    ht.set('region', 'us-east');
    assert.equal(ht.delete('region'), true);
    assert.equal(ht.get('region'), null);
    assert.equal(ht.delete('region'), false);
  });
});
