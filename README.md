# 🧠 DS Overflow — 3D Tactile Data Structures Visualizer

An interactive, tactile 3D Data Structures Visualizer and learning playground built with Neo-Brutalist aesthetics, mechanical keycap physics, and real-time algorithm stepping.

---

## ✨ Features

- **🎮 3D Tactile Keycaps**: Extruded keyboard keycaps with physical elevation, press-down animations, and Web Audio API mechanical switch sounds.
- **📚 6 Core Data Structures**:
  - **Array**: Contiguous memory blocks, random access $O(1)$, element insertion/deletion with shifting $O(n)$, animated linear search.
  - **Linked List**: Dynamic nodes with data & next pointers, $O(1)$ head insertion/deletion, linear traversal.
  - **Stack (LIFO)**: Vertical drop chute with plate bouncing physics, click-to-pop top item.
  - **Queue (FIFO)**: Directional conveyor pipeline with Entry (Rear) and Exit (Front).
  - **Binary Search Tree (BST)**: Recursive branching tree with animated comparison paths ($O(\log n)$) and in-order sorted traversal.
  - **Hash Table**: Indexed mailbox slots with modular hash function formula and separate chaining for collisions.
- **⏭️ Interactive Stepper Controls**: Play, pause, or step forward one operation at a time (`Step Next`).
- **💻 Live Synchronized Code Tracing**: Real-time line-by-line code highlighting corresponding to active operations.
- **✨ Algorithmic Presets**: 1-click test scenarios (e.g. *Worst-Case Search*, *Balanced Tree*, *Collision Chain*).
- **👆 Direct Manipulation**: Click directly on any keycap node to inspect memory address, values, or trigger instant actions.

---

## 🚀 Local Development

Simply open `index.html` in any modern web browser, or start a local static server:

```bash
# Using Python
python3 -m http.server 8080

# Or using npx serve
npx serve .
```

---

## 🌐 Deploy to Firebase Hosting

1. Install the Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Connect your Firebase project:
   ```bash
   firebase use --add
   ```

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

---

## 📦 Tech Stack

- **HTML5 & CSS3** (Tailwind CSS via CDN)
- **Vanilla JavaScript** (ES6+, Web Audio API)
- **SVG & Canvas Graphics**

