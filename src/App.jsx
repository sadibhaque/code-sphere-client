import { Button } from "@/components/ui/button";
import { ModeToggle } from './components/ModeToggle';

function App() {
    return (
        <div className="flex min-h-svh bg-accent flex-col items-center justify-center">
            <Button>Click me</Button>
            <ModeToggle></ModeToggle>
        </div>
    );
}

export default App;
