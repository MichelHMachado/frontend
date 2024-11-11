"use client";

import { withAuth } from "@/components/Auth/WithAuth";

function Home() {
  return <div>Home Page</div>;
}

export default withAuth(Home);
