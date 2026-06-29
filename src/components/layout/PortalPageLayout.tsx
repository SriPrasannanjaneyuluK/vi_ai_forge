import { PageLayout } from "@/components/layout/PageLayout";

type PortalPageLayoutProps = {
  children: React.ReactNode;
  width?: "full" | "narrow";
};

/** @deprecated Use PageLayout directly */
export function PortalPageLayout({
  children,
  width = "full",
}: PortalPageLayoutProps) {
  return <PageLayout width={width}>{children}</PageLayout>;
}
