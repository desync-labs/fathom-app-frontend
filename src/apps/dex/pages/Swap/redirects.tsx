import { Navigate, useLocation, useParams } from "react-router-dom";

// Redirects to swap but only replace the pathname
export const RedirectPathToSwapOnly = () => {
  const location = useLocation();
  return <Navigate to={"/swap"} {...location} />;
};

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export const RedirectToSwap = () => {
  const { outputCurrency } = useParams();
  const location = useLocation();
  const { search } = location;

  return (
    <Navigate
      to={{
        ...location,
        pathname: "/swap",
        search:
          search && search.length > 1
            ? `${search}&outputCurrency=${outputCurrency}`
            : `?outputCurrency=${outputCurrency}`,
      }}
    />
  );
};
