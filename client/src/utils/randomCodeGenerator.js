export function randomCodeGenerator(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function playerTurn() {
  let x = Math.floor(Math.random() * 10 + 1);
  console.log(x);
  if (x % 2 === 0) return "Player 1";
  else return "Player 2";
}
