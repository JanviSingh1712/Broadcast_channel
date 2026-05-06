'use client';
import { useLiveContent } from '@/hooks/useContent';
import { Radio, RefreshCw, Clock, BookOpen, Wifi, WifiOff, RotateCcw, Zap } from 'lucide-react';
import { fmtDT } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

function LiveCard({ item, featured }) {
  return (
    <div className={cn(
      'bg-card border rounded-2xl overflow-hidden relative group transition-all duration-300',
      featured ? 'border-ink-500/40 shadow-glow-ink' : 'border-border'
    )}>
      {/* Animated top border for featured */}
      {featured && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-ink-500 via-coral to-lime-400 animate-border-glow" />
      )}

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: featured ? '360px' : '220px' }}>
        <img
          src={item.fileUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {featured && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/90 backdrop-blur-sm border border-coral-400/30">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-display font-bold text-white uppercase tracking-wider">Live Now</span>
          </div>
        )}

        {/* Content info overlay for non-featured */}
        {!featured && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-display font-bold text-text text-sm leading-tight drop-shadow">{item.title}</p>
            <p className="text-xs font-mono text-ink-300 mt-0.5 drop-shadow">{item.subject}</p>
          </div>
        )}
      </div>

      <div className="p-5">
        {featured && (
          <>
            <div className="flex items-start gap-3 mb-3">
              <div>
                <h2 className="font-display font-bold text-xl text-text leading-tight">{item.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <BookOpen size={13} className="text-ink-400" />
                  <span className="text-sm font-mono text-ink-400 font-medium">{item.subject}</span>
                </div>
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-sub leading-relaxed mb-4">{item.description}</p>
            )}
          </>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-[11px] font-mono text-faint">
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span>{fmtDT(item.startTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span>Until {fmtDT(item.endTime)}</span>
          </div>
          {item.rotationDuration && (
            <div className="flex items-center gap-1.5">
              <RotateCcw size={10} />
              <span>Rotates {item.rotationDuration}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LivePage({ params }) {
  const { teacherId } = params;
  const { data, loading, error, refetch } = useLiveContent(teacherId);
  const items = data?.data || [];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Ambient */}
      <div className="orb w-96 h-96 bg-ink-500/10 -top-32 left-1/2 -translate-x-1/2 animate-glow-pulse" />

      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-border bg-canvas/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ink-500 flex items-center justify-center shadow-glow-ink">
              <Radio size={14} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-text">BroadcastED</span>
              <p className="text-[10px] font-mono text-faint">Public Broadcast</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live/Offline indicator */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono',
              items.length > 0
                ? 'text-lime-400 border-lime-400/30 bg-lime-400/10'
                : 'text-sub border-border bg-surface'
            )}>
              {items.length > 0
                ? <><span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" /> On Air</>
                : <><WifiOff size={10} /> Off Air</>
              }
            </div>

            <button
              onClick={refetch}
              className="p-2 rounded-lg text-faint hover:text-text hover:bg-surface transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        {loading ? (
          <div className="space-y-5 animate-pulse">
            <div className="h-80 rounded-2xl bg-card" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 rounded-2xl bg-card" />
              <div className="h-48 rounded-2xl bg-card" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-coral-400/10 border border-coral-500/20 flex items-center justify-center mb-4">
              <WifiOff size={24} className="text-coral-400" />
            </div>
            <h3 className="font-display font-bold text-text mb-1">Connection error</h3>
            <p className="text-sm text-sub mb-5">{error}</p>
            <button onClick={refetch} className="btn-primary">
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
                <Radio size={30} className="text-muted" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-faint" />
              </div>
            </div>
            <h3 className="font-display font-bold text-2xl text-text mb-2">No content available</h3>
            <p className="text-sub max-w-sm text-sm leading-relaxed">
              No content is broadcasting at the moment. Check back soon — this page auto-refreshes every 30 seconds.
            </p>

            <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs font-mono text-faint">
              <RefreshCw size={11} className="animate-spin-slow" />
              Auto-refreshing every 30s
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Zap size={13} className="text-lime-400" />
                  <span className="text-xs font-mono text-lime-400 uppercase tracking-wider">Live Broadcast</span>
                </div>
                <h1 className="font-display font-bold text-xl text-text">Now Playing</h1>
              </div>
              <span className="text-xs font-mono text-faint">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Featured first item */}
            <LiveCard item={items[0]} featured />

            {/* Remaining items */}
            {items.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.slice(1).map(item => (
                  <LiveCard key={item.id} item={item} featured={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-[11px] font-mono text-muted border-t border-border/50">
        BroadcastED · Made by Janvi · Auto-refreshes every 30s
      </footer>
    </div>
  );
}
