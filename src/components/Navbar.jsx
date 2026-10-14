import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>DEV@Deakin</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#questions">Questions</a>
        <Link to="/Article">Article</Link>
        <a href="#tutorials">Tutorials</a>
      </div>
      <div className="nav-right">
        <input type="text" placeholder="Search..." />
      
<Link to="/login">Log in</Link>
<Link to="/signup">Sign up</Link>



      </div>
    </nav>);
}

export default Navbar;