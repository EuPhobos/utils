test chain:
Client Canvas (draw red square)--> socket.io --> websocket --> network --> nodejs --> file io --> bash loop1 --> file io --> bash loop2

bash loop2 --> file io --> bash loop1 --> file io --> nodejs --> network --> websocket --> socket.io --> client canvas (draw blue square)
