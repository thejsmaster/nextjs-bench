import React, { lazy, Suspense } from "react";
import type { GetServerSideProps } from "next";
import { PAGE_MAP } from "../lib/pageData";

// Lazy-load all 20 components
const DataSummaryCard = lazy(() => import("../components/custom/DataSummaryCard"));
const UserProfileBlock = lazy(() => import("../components/custom/UserProfileBlock"));
const ProductInfoPanel = lazy(() => import("../components/custom/ProductInfoPanel"));
const ActivityTimeline = lazy(() => import("../components/custom/ActivityTimeline"));
const MetricsWidget = lazy(() => import("../components/custom/MetricsWidget"));
const StatusOverview = lazy(() => import("../components/custom/StatusOverview"));
const DataTableSection = lazy(() => import("../components/custom/DataTableSection"));
const DetailViewPanel = lazy(() => import("../components/custom/DetailViewPanel"));
const NotificationCenter = lazy(() => import("../components/custom/NotificationCenter"));
const AnalyticsChart = lazy(() => import("../components/custom/AnalyticsChart"));
const UIButton = lazy(() => import("../components/ui/UIButton"));
const UITextBlock = lazy(() => import("../components/ui/UITextBlock"));
const UICard = lazy(() => import("../components/ui/UICard"));
const UIBadge = lazy(() => import("../components/ui/UIBadge"));
const UIChip = lazy(() => import("../components/ui/UIChip"));
const UISpinner = lazy(() => import("../components/ui/UISpinner"));
const UISwitch = lazy(() => import("../components/ui/UISwitch"));
const UIProgress = lazy(() => import("../components/ui/UIProgress"));
const UISkeleton = lazy(() => import("../components/ui/UISkeleton"));
const UIIcon = lazy(() => import("../components/ui/UIIcon"));

interface PageProps {
  id: string;
  title: string;
  desc: string;
  hue: number;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const raw = ctx.params?.id as string;
  const id = raw?.replace(/^page-/, "");
  const page = PAGE_MAP.get(id);
  if (!page) return { notFound: true };
  return { props: page };
};

export default function BenchmarkPage({ title, desc, hue }: PageProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ color: `hsl(${hue},65%,57%)` }}>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className="component-column">
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><DataSummaryCard /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><UserProfileBlock /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><ProductInfoPanel /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><ActivityTimeline /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><MetricsWidget /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><StatusOverview /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><UIButton /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><UITextBlock /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><UICard /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><UIBadge /></Suspense></div>
      </div>
      <div className="component-column">
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><DataTableSection /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><DetailViewPanel /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><NotificationCenter /></Suspense></div>
          <div className="api-card"><Suspense fallback={<div className="api-card" />}><AnalyticsChart /></Suspense></div>
        <div className="component-full">
          <div className="component-row">
            <Suspense fallback={<div />}><UIChip /></Suspense>
            <Suspense fallback={<div />}><UISpinner /></Suspense>
            <Suspense fallback={<div />}><UISwitch /></Suspense>
            <Suspense fallback={<div />}><UIProgress /></Suspense>
            <Suspense fallback={<div />}><UISkeleton /></Suspense>
            <Suspense fallback={<div />}><UIIcon /></Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
