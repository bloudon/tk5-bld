import { renderToString } from "react-dom/server";
import App from "./App";
export { canonicalUrl, notFoundSeo, publicRoutes } from "./seo";

export function render(pathname: string) {
  return renderToString(<App ssrPath={pathname} />);
}