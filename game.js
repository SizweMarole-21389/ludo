// Ludo rules for two players. Pure logic, no DOM and no networking,
// so the same file runs in the browser and in the node test.
(function (root) {
  const COLORS = ['#e53935', '#43a047', '#fdd835', '#1e88e5'];
  const NAMES = ['Red', 'Green', 'Yellow', 'Blue'];
  // Where each colour enters the 52 square outer track.
  const START = [0, 13, 26, 39];
  // Start squares plus the star square 8 steps after each start.
  const SAFE = new Set([0, 13, 26, 39, 8, 21, 34, 47]);

  // Outer track on a 15x15 grid as [col,row], clockwise from Red's start.
  const TRACK = [];
  function seg(c, r, dc, dr, n) {
    for (let k = 0; k < n; k++) TRACK.push([c + dc * k, r + dr * k]);
  }
  seg(1, 6, 1, 0, 5);
  seg(6, 5, 0, -1, 6);
  seg(7, 0, 1, 0, 2);
  seg(8, 1, 0, 1, 5);
  seg(9, 6, 1, 0, 6);
  seg(14, 7, 0, 1, 2);
  seg(13, 8, -1, 0, 5);
  seg(8, 9, 0, 1, 6);
  seg(7, 14, -1, 0, 2);
  seg(6, 13, 0, -1, 5);
  seg(5, 8, -1, 0, 6);
  seg(0, 7, 0, -1, 2);

  // Coloured home columns, five squares each, pointing at the centre.
  const HOME = [
    [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
    [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  ];

  // Progress p: 0 = in base, 1..51 = outer track, 52..56 = home column, 57 = home.
  const DONE = 57;

  function newState() {
    return {
      turn: 0,
      dice: null,
      tok: { 0: [0, 0, 0, 0], 2: [0, 0, 0, 0] },
      sixes: 0,
      passing: false,
      winner: null,
      seq: 0,
      msg: 'Red to roll',
      last: null,
    };
  }

  function trackIdx(seat, p) {
    return (START[seat] + p - 1) % 52;
  }

  function movable(S, seat) {
    if (S.dice == null || S.winner != null || S.passing || S.turn !== seat) return [];
    const out = [];
    S.tok[seat].forEach((p, i) => {
      if (p === 0) {
        if (S.dice === 6) out.push(i);
      } else if (p < DONE && p + S.dice <= DONE) out.push(i);
    });
    return out;
  }

  function nextTurn(S) {
    S.turn = S.turn === 0 ? 2 : 0;
    S.dice = null;
    S.passing = false;
    S.sixes = 0;
    S.msg = NAMES[S.turn] + ' to roll';
  }

  // Returns true if the roll was accepted. If S.passing ends up true the
  // caller must call nextTurn after a short pause so players can see the dice.
  function roll(S, seat, rng) {
    if (S.winner != null || S.turn !== seat || S.dice != null || S.passing) return false;
    const d = 1 + Math.floor((rng ? rng() : Math.random()) * 6);
    S.dice = d;
    S.seq++;
    S.sixes = d === 6 ? S.sixes + 1 : 0;
    if (S.sixes === 3) {
      S.msg = NAMES[seat] + ' rolled a third six, turn lost';
      S.passing = true;
    } else if (!movable(S, seat).length) {
      S.msg = NAMES[seat] + ' rolled ' + d + ', no move';
      S.passing = true;
    } else {
      S.msg = NAMES[seat] + ' rolled ' + d + ', pick a token';
    }
    return true;
  }

  function move(S, seat, i) {
    if (!movable(S, seat).includes(i)) return false;
    const d = S.dice;
    const p = S.tok[seat][i] === 0 ? 1 : S.tok[seat][i] + d;
    S.tok[seat][i] = p;
    S.last = { seat, i };
    let captured = false;
    if (p <= 51) {
      const ti = trackIdx(seat, p);
      if (!SAFE.has(ti)) {
        const opp = seat === 0 ? 2 : 0;
        S.tok[opp].forEach((q, j) => {
          if (q >= 1 && q <= 51 && trackIdx(opp, q) === ti) {
            S.tok[opp][j] = 0;
            captured = true;
          }
        });
      }
    }
    if (S.tok[seat].every((q) => q === DONE)) {
      S.winner = seat;
      S.dice = null;
      S.msg = NAMES[seat] + ' wins!';
    } else if (d === 6 || captured || p === DONE) {
      S.dice = null;
      S.msg = NAMES[seat] + (captured ? ' captured a token, roll again' : ' rolls again');
    } else {
      nextTurn(S);
    }
    return true;
  }

  const G = { COLORS, NAMES, START, SAFE, TRACK, HOME, DONE, newState, trackIdx, movable, nextTurn, roll, move };
  if (typeof module !== 'undefined' && module.exports) module.exports = G;
  else root.Ludo = G;
})(this);
