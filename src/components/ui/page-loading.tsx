import { Loading } from "./loading";

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}