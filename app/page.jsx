import { redirect } from "next/navigation";

export default function Home() {
  // Safe redirect to the login page as the app root.
  redirect("/login");
}
