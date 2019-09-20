const app = require("./server/app");

//Start the server
const port = process.env.PORT || 3000;
app.listen(3000),
  () => {
    console.log(`Server started at: ${port}`);
  };
