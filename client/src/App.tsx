

import { BrowserRouter } from "react-router-dom";
import ClientRoutes from "./routes/client/ClientRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <ClientRoutes />
    </BrowserRouter>
  );
};

export default App;