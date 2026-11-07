# Ludo for Two

A two player online Ludo game that runs in the browser. One person starts a game and sends the link, the other opens it and you are playing together, wherever you are.

Play: https://sizwemarole-21389.github.io/ludo/

## How it works
- Static page on GitHub Pages, no server of mine involved.
- The two browsers connect directly (WebRTC through PeerJS). The host's browser runs the rules and the other one sends its dice rolls and moves.
- Rules: a six brings a token out, a six rolls again, landing on a lone opponent sends it home (except on start and star squares), three sixes in a row loses the turn, exact roll needed to reach home.

## Files
- `index.html` page, drawing and networking
- `game.js` the rules (also used by the test)
- `test.js` plays 2000 random games and checks the rules (`node test.js`)
- `peerjs.min.js` PeerJS 1.5.4, included so the page has no outside dependency
