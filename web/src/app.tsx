import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AppShell } from "~/components/app-shell";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <AppShell>
          <Suspense>{props.children}</Suspense>
        </AppShell>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
