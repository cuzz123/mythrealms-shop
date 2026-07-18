import { permanentRedirect } from "next/navigation";

export default function StoryPage() {
  permanentRedirect("/about");
}
