"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@heroui/react";

export default function NavbarLayout() {
  return (
    <Navbar isBordered classNames={{
      wrapper: "max-w-[90%]",
    }}>
      <NavbarBrand>
        <p className="font-bold text-inherit">Incidentes</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem>
          <Link href="/" color="foreground">
            Ver incidentes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/crear" color="foreground">
            Crear incidente
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
