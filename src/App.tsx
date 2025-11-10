import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/NavBar";
import SocialLinks from "./social-links/sociallinks";
import { Footer } from "./components/Footer";
import Blogs from "./pages/blogs/BlogsViewPage";
import BlogSlugViewPage from "./pages/blogs/BlogSlugViewPage";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
        <Navbar />
        <BrowserRouter>
          <Routes location={""}>

            <Route path="/" element={<SocialLinks />} />
            {/* <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/portfolio" component={Portfolio} /> */}
            <Route path="/blog/:slug" element={<BlogSlugViewPage />} />
            <Route path="/blog" element={<Blogs />} />
          </Routes>
        </BrowserRouter>
            {/* <SocialLinks /> */}
        <Footer />
      </div>
    </>
  );
}