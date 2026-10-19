import { createFileRoute, redirect } from "@tanstack/react-router";
import { SharePage } from "@/components/share/share-page";
import { resolveShareFn } from "@/server-fns/share";

export const Route = createFileRoute("/share/dashboard/$id")({
  loader: async ({ params }) => {
    const resolution = await resolveShareFn({ data: { resource: "dashboard", id: params.id } });
    // Signed in, and the role may view this: open the real page, not a stub.
    if (resolution.kind === "member") throw redirect({ href: resolution.href });
    return resolution;
  },
  component: SharedItem,
});

function SharedItem() {
  return <SharePage resource="dashboard" resolution={Route.useLoaderData()} />;
}
