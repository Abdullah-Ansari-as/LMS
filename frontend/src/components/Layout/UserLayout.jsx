import React, { useMemo, useCallback } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../common/LeftSidebar";
import Header from "../common/Header";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../../redux/slices/uiSlice";

const UserLayout = () => {
  const dispatch = useDispatch();

  const { isSidebarOpen, isLectureModalOpen } = useSelector(
    (state) => state.ui
  );

  const effectiveSidebarOpen = useMemo(
    () => isSidebarOpen && !isLectureModalOpen,
    [isSidebarOpen, isLectureModalOpen]
  );

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleCloseSidebar = useCallback(() => {
    dispatch(closeSidebar());
  }, [dispatch]);

  const sidebarClasses = useMemo(() => {
    const baseClasses = [
      "bg-[#0f172a]",
      "h-screen",
      "fixed",
      "lg:static",
      "z-50",
      "transform",
      "transition-transform",
      "duration-300",
      "ease-in-out",
    ];

    const widthClasses = [
      "w-[280px]",
      "lg:w-[280px]",
      "lg:flex",
    ];

    const visibilityClasses = effectiveSidebarOpen
      ? "translate-x-0"
      : "-translate-x-full lg:translate-x-0 lg:flex";

    return [...baseClasses, ...widthClasses, visibilityClasses].join(" ");
  }, [effectiveSidebarOpen]);

  const showOverlay = effectiveSidebarOpen;

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Left Sidebar */}
      <aside className={sidebarClasses}>
        <LeftSidebar toggleSidebar={handleToggleSidebar} />
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          toggleSidebar={handleToggleSidebar}
          sidebarOpen={effectiveSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default React.memo(UserLayout);
