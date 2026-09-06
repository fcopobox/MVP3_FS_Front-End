import { createFileRoute } from "@tanstack/react-router";
import ChangePasswordPage from "@/components/ChangePasswordPage";

export const Route = createFileRoute("/change-password")({
    component: ChangePasswordPage,
});
