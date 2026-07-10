import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("auth/login.tsx"),
  layout("(staff)/staff-layout.tsx", [
    route("dashboard", "(staff)/dashboard/dashboard.tsx"),
    route("log", "(staff)/log/log.tsx"),
    route("loyalty", "(staff)/loyalty/loyalty.tsx"),
    route("registration", "(staff)/registration/registration.tsx"),
    route("report", "(staff)/report/report.tsx"),
    route("room", "(staff)/room/room.tsx"),
    route("search", "(staff)/search/search.tsx"),
    route("user", "(staff)/user/user.tsx"),
    route("vip", "(staff)/vip/vip.tsx"),
  ]),
] satisfies RouteConfig;
