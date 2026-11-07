// Plays random games to the end and checks the rules hold.
const G = require('./game.js');
const assert = require('assert');

assert.strictEqual(G.TRACK.length, 52);
assert.strictEqual(new Set(G.TRACK.map((c) => c.join(','))).size, 52);
for (let k = 0; k < 52; k++) {
  const [a, b] = [G.TRACK[k], G.TRACK[(k + 1) % 52]];
  const dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
  // Straight step, or the one diagonal step at each arm corner (as on a real board).
  assert(dx + dy === 1 || (dx === 1 && dy === 1), 'gap at ' + k);
}
// Each colour's last track square must sit next to the first home square.
[0, 2].forEach((seat) => {
  const last = G.TRACK[G.trackIdx(seat, 51)];
  const first = G.HOME[seat][0];
  assert.strictEqual(Math.abs(last[0] - first[0]) + Math.abs(last[1] - first[1]), 1);
});

let finished = 0, captures = 0;
for (let n = 0; n < 2000; n++) {
  const S = G.newState();
  let steps = 0;
  while (S.winner == null && steps++ < 20000) {
    assert(G.roll(S, S.turn));
    if (S.passing) { G.nextTurn(S); continue; }
    const seat = S.turn;
    const opts = G.movable(S, seat);
    assert(opts.length > 0);
    assert(opts.includes(G.autoPick(S, seat)));
    const before = [...S.tok[0], ...S.tok[2]].filter((p) => p === 0).length;
    assert(G.move(S, seat, opts[Math.floor(Math.random() * opts.length)]));
    const after = [...S.tok[0], ...S.tok[2]].filter((p) => p === 0).length;
    if (after > before) captures++;
    [0, 2].forEach((s) => S.tok[s].forEach((p) => assert(p >= 0 && p <= G.DONE)));
  }
  assert(S.winner != null, 'game did not finish');
  finished++;
}
// Safe squares must never allow a capture.
const S = G.newState();
S.tok[0][0] = 1;            // Red on its start square (safe)
S.tok[2][0] = 27 - 26 + 0;  // Yellow p=1 sits on index 26, not index 0
S.turn = 2; S.dice = 6;
S.tok[2][0] = 26; // p=26 -> index (26+25)%52=51 ; rolling 1 lands index 0
S.dice = 1; S.tok[2][0] = 26;
G.move(S, 2, 0);
assert.strictEqual(S.tok[0][0], 1, 'capture happened on a safe square');
console.log('ok:', finished, 'games finished,', captures, 'captures seen');
