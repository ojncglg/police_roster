import { useState, useEffect, useMemo } from 'react';
import theme from '../styles/theme';

type Breakpoint = keyof typeof theme.breakpoints;

interface WindowSize {
  width: number;
  height: number;
}

function getBreakpointValue(breakpoint: string): number {
  return Number.parseInt(breakpoint.replace(/[^\d]/g, ''), 10);
}

/**
 * Convert breakpoint string to number
 * e.g., '640px' -> 640
 */
const breakpointValues = Object.entries(theme.breakpoints).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: getBreakpointValue(value)
  }),
  {} as Record<Breakpoint, number>
);

/**
 * Hook to get current window size
 */
function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to check if the current viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

interface ResponsiveUtils {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  breakpoint: Breakpoint;
  windowSize: WindowSize;
  up: (breakpoint: Breakpoint) => boolean;
  down: (breakpoint: Breakpoint) => boolean;
  between: (start: Breakpoint, end: Breakpoint) => boolean;
  is: (breakpoint: Breakpoint) => boolean;
}

/**
 * Main hook for responsive design utilities
 */
export function useResponsive(): ResponsiveUtils {
  const windowSize = useWindowSize();
  const { width } = windowSize;

  // Memoize breakpoint checks
  const breakpointChecks = useMemo(() => {
    const isMobile = width < breakpointValues.md;
    const isTablet = width >= breakpointValues.md && width < breakpointValues.lg;
    const isDesktop = width >= breakpointValues.lg && width < breakpointValues.xl;
    const isLargeDesktop = width >= breakpointValues.xl;

    // Determine current breakpoint
    let breakpoint: Breakpoint = 'sm';
    if (width >= breakpointValues['2xl']) breakpoint = '2xl';
    else if (width >= breakpointValues.xl) breakpoint = 'xl';
    else if (width >= breakpointValues.lg) breakpoint = 'lg';
    else if (width >= breakpointValues.md) breakpoint = 'md';

    return {
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      breakpoint
    };
  }, [width]);

  // Utility functions
  const up = (breakpoint: Breakpoint) => width >= breakpointValues[breakpoint];
  const down = (breakpoint: Breakpoint) => width < breakpointValues[breakpoint];
  const between = (start: Breakpoint, end: Breakpoint) =>
    width >= breakpointValues[start] && width < breakpointValues[end];
  const is = (breakpoint: Breakpoint) => breakpointChecks.breakpoint === breakpoint;

  return {
    ...breakpointChecks,
    windowSize,
    up,
    down,
    between,
    is
  };
}

/**
 * Hook for responsive padding and margin values
 */
export function useResponsiveSpacing() {
  const { isMobile, isTablet } = useResponsive();

  return {
    getSpacing: (mobile: string, tablet: string, desktop: string) => {
      if (isMobile) return mobile;
      if (isTablet) return tablet;
      return desktop;
    }
  };
}

/**
 * Hook for responsive font sizes
 */
export function useResponsiveFont() {
  const { isMobile, isTablet } = useResponsive();

  return {
    getFontSize: (mobile: string, tablet: string, desktop: string) => {
      if (isMobile) return mobile;
      if (isTablet) return tablet;
      return desktop;
    }
  };
}

// Example usage:
/*
function MyComponent() {
  const {
    isMobile,
    isTablet,
    isDesktop,
    up,
    down,
    between
  } = useResponsive();

  const { getSpacing } = useResponsiveSpacing();
  const { getFontSize } = useResponsiveFont();

  return (
    <div
      style={{
        padding: getSpacing('1rem', '2rem', '3rem'),
        fontSize: getFontSize('14px', '16px', '18px')
      }}
    >
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
      
      {up('lg') && <ShowOnLargeScreens />}
      {down('md') && <ShowOnSmallScreens />}
      {between('md', 'lg') && <ShowOnMediumScreens />}
    </div>
  );
}
*/
