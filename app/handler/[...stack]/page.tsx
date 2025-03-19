// /app/handler/[...stack]/page.tsx 
import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler({
  params,
  searchParams,
}: {
  readonly params?: { readonly stack?: string[] };
  readonly searchParams?: Record<string, string>;
}) {
  return <StackHandler app={stackServerApp} params={params} searchParams={searchParams} fullPage={true} />;
}
