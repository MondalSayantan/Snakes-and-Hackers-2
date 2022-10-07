const Box = ({
  currentUser,
  amazonPrice,
  amazonTitle,
  amazonImage,
  oppAmazonTitle,
  oppAmazonPrice,
  oppAmazonImage,
  boardData,
}) => {
  let sign;
  let otherSign;

  const setSign = () => {
    boardData.forEach((cell) => {
      if (cell === "" && currentUser === "Player 1") {
        sign = "X";
        otherSign = "O";
      } else {
        sign = "O";
        otherSign = "X";
      }
    });
  };

  setSign();

  return (
    <div className="w-full flex justify-around items-center text-white">
      <div className="border-2 border-solid flex border-lime-500 p-4 justify-center items-center w-full m-5 h-full">
        <div className=" flex flex-col">
          <h1>
            {currentUser} (You): {sign}
          </h1>
          <h1>Item: {amazonTitle}</h1>
          <h1>Price: {amazonPrice}</h1>
        </div>
        <img src={amazonImage} alt="product" className="h-48 w-32 ml-5" />
      </div>
      <div className="w-full"></div>
      <div className="border-2 border-solid flex border-lime-500 p-4 justify-center items-center h-full w-full m-5 ">
        <div className=" flex flex-col">
          {currentUser === "Player 1" ? (
            <h1>Player 2 (Opponent): {otherSign}</h1>
          ) : (
            <h1>Player 1 (Opponent): {otherSign}</h1>
          )}
          <h1>Item: {oppAmazonTitle}</h1>
          <h1>Price: {oppAmazonPrice}</h1>
        </div>
        <img src={oppAmazonImage} alt="product" className="h-48 w-32 ml-5" />
      </div>
    </div>
  );
};

export default Box;
