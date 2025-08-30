import { Footer } from "./components/Footer"
import { Navbar } from "./components/NavBar"
import SocialLinks from "./social-links/sociallinks"


function App() {
  return (
    <>
     <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 py-8 px-4">
      <Navbar/>
      <SocialLinks />
      <Footer/>
     </div>
    </>
  )
}

export default App
