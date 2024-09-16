import { Button } from "@/components/ui/button";
import { Alert } from "./components/ui/alert";

function App() {
  return (
    <>
      <div className=" justify-center items-center flex h-screen">
        <Button>Click me</Button>
        <Alert type="success">This is a success alert</Alert>
      </div>
    </>
  );
}

export default App;
