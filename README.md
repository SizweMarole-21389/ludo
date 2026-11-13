# Ludo for Two

A two player online Ludo game that runs in the browser. One person starts a game and sends the link, the other opens it, and you play together from anywhere.

**Play:** https://sizwemarole-21389.github.io/ludo/

## Features

- **Rules:** a six brings a token out, a six rolls again, landing on a lone opponent sends it home (except on start and star squares), three sixes in a row lose the turn, and an exact roll is needed to reach home.
- **Turn timer:** each turn has 10 seconds. The bar turns red when time is almost up.
- **3D dice and shaded pawns** on a classic board.
- **Movable tokens are highlighted** after each roll, so you can see which pawn you can move.
- **Pawns walk square by square**, so you can follow every move.
- **Sound on and off**, and a win celebration.
- **Play again** after a finished game.
- **Resume my last game** if the page closes.
- **Send on WhatsApp** to share the invite link.
- **Reconnects and resyncs:** each browser says hello every 4 seconds, and a stale page reloads itself to pick up the current state.
- **Two brokers:** it connects through `broker.hivemq.com` and falls back to `broker.emqx.io`, over secure WebSocket, so phones on any network can join.
- **Neutral theme** and an iOS fix for the touch behaviour.

## How it works

- Static page on GitHub Pages, with no server of mine involved.
- The two browsers talk through a public MQTT broker. The host's browser runs the rules, and the other player sends their dice rolls and moves.

## Files

- `index.html`: the page, drawing and networking
- `game.js`: the rules, shared by the page and the test
- `test.js`: plays 2000 random games and checks the rules. Run it with `node test.js`. The last run finished 2000 games with 5410 captures and no rule failures.
- `mqtt.min.js`: the MQTT client, included so the page has no outside script dependency
