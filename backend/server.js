const express = require("express");
const cors = require("cors");
const profitRoutes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/profit-calculation", profitRoutes);


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

