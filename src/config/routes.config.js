import Feed from "./../components/pages/Feed/Feed.jsx";
import Search from "./../components/pages/Search/Search";
import NewPost from "./../components/pages/NewPost/NewPost";
import PostPage from "./../components/pages/PostPage/PostPage";
import Profile from "./../components/pages/Profile/Profile";
import NotificationPage from "./../components/pages/NotificationPage/NotificationPage";
import Login from "./../components/pages/Login/Login";
import Register from "./../components/pages/Register/Register";
import Source from "./../components/pages/Source/Source";
import TagPage from "./../components/pages/TagPage/TagPage";

export const routes = {
  feed: "/",
  search: "/search",
  newPost: "/new",
  repost: "/repost",
  postHash: "/post/:hash",
  post: "/post",
  profile: "/profile",
  notification: "/notification",
  register: "/register",
  login: "/login",

  passwordRecovery: "/password-recovery",
  source: "/source",
  sourceAddress: "/source/:address",
  tag: "/tag",
  tagTagName: "/tag/:address/:tag",
};

export const routeConfig = [
  {
    path: routes.feed,
    component: Feed,
    exact: true,
  },
  {
    path: routes.search,
    component: Search,
    exact: true,
  },
  {
    path: routes.newPost,
    component: NewPost,
    exact: true,
  },
  {
    path: routes.postHash,
    component: PostPage,
    exact: false,
  },
  {
    path: routes.sourceAddress,
    component: Source,
    exact: false,
  },
  {
    path: routes.profile,
    component: Profile,
    exact: true,
  },
  {
    path: routes.tagTagName,
    component: TagPage,
    exact: true,
  },
  {
    path: routes.notification,
    component: NotificationPage,
    exact: true,
  },
  {
    path: routes.login,
    component: Login,
    exact: true,
  },
  {
    path: routes.register,
    component: Register,
    exact: true,
  },
];

/**
 * For use middleware on routing - create own push, go, goBack methods
 *    for invoke middleware function before route to a page
 */
