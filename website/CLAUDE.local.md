# Website Package - Contextual Memory

## Key Design Decisions

**Aelea Framework**: Functional reactive UI with stream-based state management for real-time updates

**PWA Architecture**: Service worker caching and offline support for mobile-first experience

**Viem Integration**: Type-safe blockchain interactions with optimistic updates and rollback

## Critical Implementation Gotchas

**Transaction Handling**: Must implement optimistic updates with rollback on failure to prevent UI lag

**WebSocket Reconnection**: Auto-reconnect on disconnect - connection drops are common

**State Persistence**: LocalStorage for user preferences, but cache invalidation critical for price data

**Performance**: Virtual lists required for trader/position lists - DOM performance bottleneck otherwise

## PWA Requirements

**Service Worker**: Cache static assets for offline functionality
**Manifest**: Mobile app installation with proper icons and metadata
