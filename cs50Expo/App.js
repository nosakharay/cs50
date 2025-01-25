import { GeneralContextProvider } from './components/globalContext';
import Application from './application';

export default function App() {

  return (
    <GeneralContextProvider>
      <Application/>
    </GeneralContextProvider>
  );
}
