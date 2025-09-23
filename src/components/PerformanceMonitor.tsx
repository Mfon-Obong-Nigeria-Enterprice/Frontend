import { useEffect } from 'react';

interface PerformanceMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const metrics: PerformanceMetrics = {
          navigationStart: navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        };

        // Get paint metrics if available
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        // Log metrics in development
        if (import.meta.env.DEV) {
          console.group('🚀 Performance Metrics');
          console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`);
          console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`);
          if (metrics.firstPaint) {
            console.log('First Paint:', `${metrics.firstPaint.toFixed(2)}ms`);
          }
          if (metrics.firstContentfulPaint) {
            console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
          }
          console.groupEnd();

          // Performance warnings
          if (metrics.domContentLoaded > 3000) {
            console.warn('⚠️ Slow DOM Content Loaded time detected');
          }
          if (metrics.loadComplete > 5000) {
            console.warn('⚠️ Slow page load time detected');
          }
        }
      }
    };

    // Measure after load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return null;
};

export default PerformanceMonitor;