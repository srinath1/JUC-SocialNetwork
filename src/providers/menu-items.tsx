import { Home, Search, User, Bell, LogOut } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { getUnreadNotificationsCount } from "@/server-actions/Notifications";

function MenuItems() {
  const iconSize = 16;
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { signOut } = useAuth();

  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    React.useState(0);

  const menuItems = [
    {
      name: "Home",
      icon: <Home size={iconSize} />,
      path: "/",
      isActive: pathname === "/",
    },
    {
      name: "Search",
      icon: <Search size={iconSize} />,
      path: "/search",
      isActive: pathname === "/search",
    },
    {
      name: "Profile",
      icon: <User size={iconSize} />,
      path: `/profile/${loggedInUserData?._id}`,
      isActive: pathname === `/profile/${params.id}`,
    },
    {
      name: "Notifications",
      icon: <Bell size={iconSize} />,
      path: "/notifications",
      isActive: pathname === "/notifications",
    },
    {
      name: "Logout",
      icon: <LogOut size={iconSize} />,
      path: "/logout",
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };
  React.useEffect(() => {
    getUnreadNotificationsCount(loggedInUserData?._id!).then((res: any) => {
      if (res.success) {
        setUnreadNotificationsCount(res?.data);
      }
    });
  }, []);

  return (
    <div className="w-56 lg:h-screen lg:bg-gray-300 p-5">
      <div className="mt-5 flex flex-col">
        <span className="text-2xl font-bold text-info">
          JUC <b className="text-primary">SocialNetwork Instagram</b>
        </span>
        <span className="text-sm">{loggedInUserData?.name}</span>
      </div>

      <div className="mt-20 flex flex-col gap-12">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer px-5 py-2 flex gap-3 items-center ${
              item.isActive && "bg-info text-white rounded-sm"
            }`}
            onClick={() => {
              if (item.name === "Logout") {
                handleLogout();
              } else {
                if (
                  item.name === "Notifications" &&
                  unreadNotificationsCount > 0
                ) {
                  setUnreadNotificationsCount(0);
                }
                router.push(item.path);
              }
            }}
          >
            {item.icon}
            <span className="text-sm items-center gap-3">{item.name}</span>
            {item.name === "Notifications" && unreadNotificationsCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 text-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuItems;
