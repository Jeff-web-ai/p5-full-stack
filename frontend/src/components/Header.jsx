import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
} from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";
import { NavigationMenuList } from "./ui/navigation-menu";

const Header = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const handleClick = () => {
    logout();

    navigate("/");
  };

  return (
    <header className="w-full py-3 bg-primary">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-primary-foreground hover:text-white transition-colors"
        >
          ServiceSync
        </Link>
        <nav>
          {user ? (
            // For customer user
            user.role === "customer" ? (
              <NavigationMenu>
                <NavigationMenuList className="hidden md:flex space-x-4">
                  <NavigationMenuItem>
                    <Link
                      to="/customer"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/customer/request-service"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Book
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/customer/profile"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Profile
                    </Link>
                  </NavigationMenuItem>
                  <Button
                    variant="outline"
                    onClick={handleClick}
                    className="text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-300 ease-in-out"
                  >
                    Log out
                  </Button>
                </NavigationMenuList>
              </NavigationMenu>
            ) : // For store owner user
            user.role === "store_owner" ? (
              <NavigationMenu>
                <NavigationMenuList className="hidden md:flex space-x-4">
                  <NavigationMenuItem>
                    <Link
                      to="/store-dashboard"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/store-job-status"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      On-going Services
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/store-completed-jobs"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Service History
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/store-profile"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Profile
                    </Link>
                  </NavigationMenuItem>
                  <Button
                    variant="outline"
                    onClick={handleClick}
                    className="text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-300 ease-in-out"
                  >
                    Log out
                  </Button>
                </NavigationMenuList>
              </NavigationMenu>
            ) : // For super admin user
            user.role === "super_admin" ? (
              <NavigationMenu>
                <NavigationMenuList className="hidden md:flex space-x-4">
                  <NavigationMenuItem>
                    <Link
                      to="/admin"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/admin/customers"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Customers
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/admin/stores"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Store Owners
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/admin/services"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Services
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/admin/jobs"
                      className="text-primary-foreground hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      Jobs
                    </Link>
                  </NavigationMenuItem>
                  <Button
                    variant="outline"
                    onClick={handleClick}
                    className="text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-300 ease-in-out"
                  >
                    Log out
                  </Button>
                </NavigationMenuList>
              </NavigationMenu>
            ) : null
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-300 ease-in-out"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                variant="outline"
                className="text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-300 ease-in-out"
              >
                <Link to="/register-non-user">Signup</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
