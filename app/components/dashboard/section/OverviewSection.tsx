import type { DashboardCtx } from '../types';
import { GreetingBanner } from './overview/GreetingBanner';
import { HomeCards } from './overview/HomeCards';
import { QuickTiles } from './overview/QuickTiles';
import { LibraryCards } from './overview/LibraryCards';
import { VocabularyBlock } from './overview/VocabularyBlock';

export function OverviewSection({ ctx }: { ctx: DashboardCtx }) {
  return (
    <div className="space-y-10">
      <GreetingBanner ctx={ctx} />
      <HomeCards ctx={ctx} />
      <QuickTiles ctx={ctx} />
      <LibraryCards ctx={ctx} />
      <VocabularyBlock ctx={ctx} />
    </div>
  );
}