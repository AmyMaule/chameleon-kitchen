import Footer from "./components/Footer";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Tabs from "./components/Tabs";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <Intro />
      <Tabs />
      <Footer />
    </div>
  )
}

export default App;
