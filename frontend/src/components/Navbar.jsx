import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/pincode", label: "PIN Lookup" },
  { to: "/distance", label: "Distance" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(10, 10, 15, 0.85)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <img src="/favicon.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-lg tracking-tight">
            Pin<span className="text-saffron">India</span>
          </span>
        </NavLink>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-display font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-saffron/15 text-saffron"
                    : "hover:bg-white/5"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? undefined : "rgba(245, 240, 232, 0.4)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-2 py-1.5 rounded-lg font-display font-medium text-xs transition-all duration-200 ${
                  isActive ? "bg-saffron/15 text-saffron" : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? undefined : "rgba(245, 240, 232, 0.3)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
