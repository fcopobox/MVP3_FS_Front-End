import { createFileRoute } from "@tanstack/react-router";
import EmailPage from "@/components/EmailPage";

export const Route = createFileRoute("/email")({
    component: EmailPage,
});
