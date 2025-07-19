import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerList from "./banner/BannerList";
import CreateNewBanner from "./banner/CreateNewBanner";
import ContactList from "./contact/ContactList";
import GalleryAdmin from "./gallery/GalleryAdmin";
import AboutAdmin from "./about/AboutAdmin";
import "./AdminDashboard.css";
import AdminBlogPanel from "./blogPanel/AdminBlogPanel";
import AdminTourBookings from "./booking/AdminTourBooking";
import AdminTour from "./tour/AdminTour";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <h2> Dashboard Overview</h2>
            <p>Welcome to the Kerala Travel Admin Panel. Use the sidebar to manage banners, gallery, and contact submissions.</p>
          </>
        );
      case "list":
        return <BannerList />;
      case "upload":
        return <CreateNewBanner />;
      case "contact":
        return <ContactList />;
      case "gallery":
        return <GalleryAdmin />;
      case "about":
        return <AboutAdmin />;
      case "AdminBlogPanel":
        return <AdminBlogPanel />;
      case "AdminTourBookings":
        return <AdminTourBookings />;
      case "AdminTour":
        return <AdminTour />;

      default:
        return <p>Invalid Tab</p>;
    }
  };

  return (
    <div className="admin-dashboard d-flex" style={{ minHeight: "100vh" }}>
      <div className="sidebar bg-dark text-white p-3" style={{ minWidth: "220px" }}>
        <h4 className="text-center">Kerala Travel</h4>
        <ul className="nav flex-column mt-4">
          {[
            { label: " Dashboard", key: "dashboard" },
            { label: " View Banners", key: "list" },
            { label: " Upload Banner", key: "upload" },
            { label: " Contact Submissions", key: "contact" },
            { label: " Manage Gallery", key: "gallery" },
            { label: " About Section", key: "about" }
            , { label: " Blog Management", key: "AdminBlogPanel" }
            , { label: " Tour Bookings", key: "AdminTourBookings" }
            , { label: " Tour Packages", key: "AdminTour" }
          ].map((item) => (
            <li className="nav-item" key={item.key}>
              <button
                className={`nav-link text-white btn btn-link ${activeTab === item.key ? "fw-bold text-warning" : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="nav-item mt-4">
            <button className="btn btn-outline-light w-100" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>


      <div className="main-content flex-grow-1 bg-light">
        <div className="navbar bg-white shadow-sm d-flex justify-content-between align-items-center p-3">
          <div></div>
          <h5
            className="mb-0"
            style={{ cursor: "pointer" }}
            onClick={() =>
              alert(`Name: ${user?.name || "Admin"}\nEmail: ${user?.email || "admin@example.com"}`)
            }
          >
            {user?.name || "Admin"}
          </h5>
        </div>

        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
