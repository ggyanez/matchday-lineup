/**
 * Hungarian algorithm (Kuhn-Munkres) for the assignment problem.
 *
 * Given a square cost matrix, finds the perfect matching (one column per
 * row) that minimizes the total cost, in O(n^3). This is the classic
 * potentials/shortest-augmenting-path formulation.
 */
export function solveAssignment(costMatrix: number[][]): {
  /** rowAssignment[i] = column index assigned to row i */
  rowAssignment: number[];
  totalCost: number;
} {
  const n = costMatrix.length;
  if (n === 0) return { rowAssignment: [], totalCost: 0 };

  // The algorithm below uses 1-indexed rows/columns internally, with a
  // virtual row/column 0 used as a sentinel.
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0); // p[j] = row currently matched to column j
  const way = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(Infinity);
    const used = new Array(n + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = -1;

      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = costMatrix[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) {
          minv[j] = cur;
          way[j] = j0;
        }
        if (minv[j] < delta) {
          delta = minv[j];
          j1 = j;
        }
      }

      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0);

    while (j0 !== 0) {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    }
  }

  const rowAssignment = new Array(n).fill(-1);
  for (let j = 1; j <= n; j++) {
    if (p[j] !== 0) rowAssignment[p[j] - 1] = j - 1;
  }

  return { rowAssignment, totalCost: -v[0] };
}
