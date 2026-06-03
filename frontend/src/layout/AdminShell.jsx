import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  LogOut,
  ClipboardList,
  BookPlus,
  Table as TableIcon,
  Inbox,
  RotateCcw,
  Library,
  Wallet,
  Settings,
  Bell,
  Search,
  ChevronDown,
  UserCircle,
  Book
} from "lucide-react";
import AdminFooter from "../components/AdminFooter";
import { Server_URL } from "../utils/config";
import { getAuthToken } from "../utils/auth";
import ThemeSwitcher from "../components/ThemeSwitcher";
import "../pages/admin/AdminDashboard.css";
import "./adminheader.css";

export default function AdminShell() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [profile, setProfile] = useState({ name: role === "librarian" ? "Librarian" : "Administrator", role: role || "admin" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ books: [], members: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const linkClass = ({ isActive }) =>
    `admin-nav-btn${isActive ? " active" : ""}`;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${Server_URL}users/profile`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (res.data && (res.data.user || res.data.name)) {
          const u = res.data.user || res.data;
          setProfile({ name: u.name, role: u.role || role, profilePicture: u.profilePicture });
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
      }
    };
    fetchProfile();
  }, [role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSrc = profile.profilePicture || (role === "librarian" ? "https://ui-avatars.com/api/?name=Librarian&background=0D8ABC&color=fff" : "/admin-avatar.png");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (query.trim().length > 1) {
      searchDebounceRef.current = setTimeout(async () => {
        try {
          const headers = { Authorization: `Bearer ${getAuthToken()}` };
          const [booksRes, usersRes] = await Promise.all([
            axios.get(`${Server_URL}books`, { headers }),
            axios.get(`${Server_URL}users`, { headers })
          ]);
          
          let filteredBooks = [];
          if (!booksRes.data.error && booksRes.data.books) {
            filteredBooks = booksRes.data.books.filter(b => 
              b.title?.toLowerCase().includes(query.toLowerCase()) || 
              b.author?.toLowerCase().includes(query.toLowerCase()) ||
              b.isbn?.includes(query)
            ).slice(0, 5);
          }

          let filteredUsers = [];
          if (!usersRes.data.error && usersRes.data.user) {
            filteredUsers = usersRes.data.user.filter(u => 
              u.role === "user" && (
                u.name?.toLowerCase().includes(query.toLowerCase()) || 
                u.email?.toLowerCase().includes(query.toLowerCase()) ||
                u.membershipId?.toLowerCase().includes(query.toLowerCase())
              )
            ).slice(0, 5);
          }

          setSearchResults({ books: filteredBooks, members: filteredUsers });
          setShowSearchDropdown(true);
        } catch (err) {
          console.error("Search error", err);
        }
      }, 300);
    } else {
      setShowSearchDropdown(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/admin" className="sidebar-logo">
          <div className="logo-box">
            <img src="/eagle-logo.png" alt="AVB Library eagle logo" className="logo-img" />
          </div>
          <span className="logo-text">AVB Library</span>
        </Link>

        <nav className="admin-sidebar-nav">
          <p className="sidebar-section-label">General</p>
          <ul className="admin-nav">
            <li className="admin-nav-item">
              <NavLink to="/admin" end className={linkClass}>
                <LayoutDashboard className="nav-icon" /> Dashboard
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink to="/admin/reports" className={linkClass}>
                <BarChart3 className="nav-icon" /> Reports
              </NavLink>
            </li>
          </ul>

          <p className="sidebar-section-label">Books</p>
          <ul className="admin-nav">
            <li className="admin-nav-item">
              <NavLink to="/admin/viewbook" className={linkClass}>
                <TableIcon className="nav-icon" /> View Books
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink to="/admin/addbook" className={linkClass}>
                <BookPlus className="nav-icon" /> Add Book
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink to="/admin/issued" className={linkClass}>
                <Library className="nav-icon" /> Books Borrowed
              </NavLink>
            </li>
          </ul>

          {(role === "librarian" || role === "admin") && (
            <>
              <p className="sidebar-section-label">Requests</p>
              <ul className="admin-nav">
                <li className="admin-nav-item">
                  <NavLink to="/admin/issuerequest" className={linkClass}>
                    <Inbox className="nav-icon" /> Issue Requests
                  </NavLink>
                </li>
                <li className="admin-nav-item">
                  <NavLink to="/admin/returnrequest" className={linkClass}>
                    <RotateCcw className="nav-icon" /> Return Requests
                  </NavLink>
                </li>
              </ul>
            </>
          )}

          {(role === "librarian" || role === "admin") && (
            <>
              <p className="sidebar-section-label">Management</p>
              <ul className="admin-nav">
                <li className="admin-nav-item">
                  <NavLink to="/admin/members" className={linkClass}>
                    <Users className="nav-icon" /> Manage Members
                  </NavLink>
                </li>
                <li className="admin-nav-item">
                  <NavLink to="/admin/reservations" className={linkClass}>
                    <ClipboardList className="nav-icon" /> Reservations
                  </NavLink>
                </li>
                <li className="admin-nav-item">
                  <NavLink to="/admin/fines" className={linkClass}>
                    <Wallet className="nav-icon" /> Fine Management
                  </NavLink>
                </li>
                <li className="admin-nav-item">
                  <NavLink to="/admin/fine-config" className={linkClass}>
                    <Settings className="nav-icon" /> Fine Settings
                  </NavLink>
                </li>
                {role === "admin" && (
                  <li className="admin-nav-item">
                    <NavLink to="/admin/addlibrarian" className={linkClass}>
                      <UserCheck className="nav-icon" /> Add Librarian
                    </NavLink>
                  </li>
                )}
              </ul>
            </>
          )}

          <div className="sidebar-footer">
            <button type="button" className="admin-nav-btn sidebar-logout" onClick={handleLogout}>
              <LogOut className="nav-icon" /> Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        {/* TOP HEADER */}
        <header className="admin-top-header">
          <div className="header-left">
            <div>
              <h2 className="header-title">
                {profile.role === "librarian" ? "Librarian Dashboard" : "Admin Dashboard"}
              </h2>
              <p className="header-subtitle">AVB Library Management System</p>
            </div>
          </div>
          
          <div className="header-center">
            <div className="header-search-box" ref={searchRef}>
              <input 
                type="text" 
                className="header-search-input" 
                placeholder="Search across dashboard..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { if (searchQuery.trim().length > 1) setShowSearchDropdown(true); }}
              />
              <Search size={18} className="header-search-icon" />

              {showSearchDropdown && (
                <div className="global-search-dropdown">
                  {searchResults.books.length === 0 && searchResults.members.length === 0 ? (
                    <div style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>No results found for "{searchQuery}".</div>
                  ) : (
                    <>
                      {searchResults.books.length > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">Books</div>
                          {searchResults.books.map(b => (
                            <div key={b._id} className="search-result-item"
                                 onClick={() => { navigate('/admin/viewbook'); setShowSearchDropdown(false); }}>
                               <div style={{ background: 'var(--accent-primary-soft)', padding: '8px', borderRadius: '8px' }}>
                                 <Book size={16} color="var(--accent-primary)" />
                               </div>
                               <div>
                                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{b.title}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{b.author}</div>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.members.length > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">Members</div>
                          {searchResults.members.map(m => (
                            <div key={m._id} className="search-result-item"
                                 onClick={() => { navigate('/admin/members'); setShowSearchDropdown(false); }}>
                               <div style={{ background: 'var(--status-success-soft)', padding: '8px', borderRadius: '8px' }}>
                                 <Users size={16} color="var(--status-success)" />
                               </div>
                               <div>
                                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{m.name}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.membershipId}</div>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="header-right">
            <ThemeSwitcher variant="inline" />
            <div className="profile-widget-container" ref={dropdownRef}>
              <div 
                className={`profile-widget ${isDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="profile-avatar-wrapper">
                  <img src={avatarSrc} alt="Avatar" className="profile-avatar" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"; }} />
                  <div className="profile-status-dot" />
                </div>
                <div className="profile-info">
                  <span className="profile-name">{profile.name}</span>
                  <span className="profile-role">{profile.role}</span>
                </div>
                <ChevronDown size={16} className="profile-arrow" />
              </div>

              <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <Link to="/admin/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <UserCircle size={18} /> My Profile
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="section-viewport">
          <Outlet context={{ profile }} />
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
