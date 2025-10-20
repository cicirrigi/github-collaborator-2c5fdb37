"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Home,
  Car,
  MapPin,
  Phone,
  Calendar,
  User,
  Settings,
} from "lucide-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Fleet",
      icon: (
        <Car className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/fleet",
    },
    {
      title: "Routes",
      icon: (
        <MapPin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/routes",
    },
    {
      title: "Book Now",
      icon: (
        <Calendar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/book",
    },
    {
      title: "Vantage Lane",
      icon: (
        <img
          src="/logo.svg"
          width={20}
          height={20}
          alt="Vantage Lane Logo"
          className="rounded-sm"
        />
      ),
      href: "/",
    },
    {
      title: "Profile",
      icon: (
        <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/profile",
    },
    {
      title: "Contact",
      icon: (
        <Phone className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/contact",
    },
    {
      title: "Settings",
      icon: (
        <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/settings",
    },
  ];

  return (
    <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
