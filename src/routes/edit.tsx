import { createFileRoute } from "@tanstack/react-router";
import { UserEditPage } from "@/components/UserEditPage";

export const Route = createFileRoute("/edit")({
    component: UserEditPage,
});
