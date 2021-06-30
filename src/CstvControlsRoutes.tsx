import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  RouteProps,
} from "react-router-dom";
import ExplorePage from "./explore/ExplorePage";
import AuthCodeRoute from "./AuthCodeRoute";
import ErrorPage from "./common/ErrorPage";
import { useCurrentExperience } from "./common/services/hooks/api";
import LoadingPage from "./common/LoadingPage";
import { isAuthAvailable } from "./common/services/apiUtils";

const ApiDependentRoute = ({
  children,
  ...rest
}: {
  children?: ReactNode;
} & RouteProps) => {
  // Based on https://reactrouter.com/web/example/auth-workflow

  // TODO: Decide if we want to create a route for authentication specifically
  //  instead of relying on 401 responses from the API. They're cached though,
  //  which is nice.
  const { status, error } = useCurrentExperience();

  return (
    <Route
      {...rest}
      render={() => {
        if (status == "loading") {
          return <LoadingPage />;
        }

        if (status == "error") {
          // TODO: Break this logic out
          let title = "An error occurred";
          let description: string | ReactNode =
            "And we don't know what to do :(";

          if (
            error?.response?.status &&
            [401, 403].includes(error.response.status)
          ) {
            const hadAuth = isAuthAvailable();
            title = hadAuth ? "Disconnected" : "Not connected";
            description = hadAuth
              ? "Scan again to reconnect."
              : "Scan the display to connect.";
          }

          return <ErrorPage title={title} description={description} />;
        }

        return children;
      }}
    />
  );
};

function CstvControlsRoutes(): JSX.Element {
  return (
    <Router>
      <Switch>
        <ApiDependentRoute exact path="/">
          <ExplorePage />
        </ApiDependentRoute>
        <Route exact path="/c/:code">
          <AuthCodeRoute />
        </Route>
        <Route path="*">
          <ErrorPage
            title={"Error 404"}
            description={
              <span>
                We couldn&lsquo;t find that page.
                <br />
                <Link to="/">Go back home?</Link>
              </span>
            }
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default CstvControlsRoutes;