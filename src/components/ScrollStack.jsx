import { useCallback, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  pageTurnAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  initialCardIndex = null,
  forceInitialPosition = false,
  onInitialPositioned,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const initialPositionedRef = useRef(false);
  const initialTimersRef = useRef([]);
  const initialLockActiveRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const holdProgress = useCallback((scrollTop, start, end, hold = 120) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;

    const range = Math.max(end - start, 1);
    const holdWindow = Math.min(hold, Math.max(range * 0.28, 1));
    const holdStart = start + range * 0.42;
    const holdEnd = Math.min(end, holdStart + holdWindow);

    if (scrollTop >= holdStart && scrollTop <= holdEnd) {
      return 0.5;
    }

    if (scrollTop < holdStart) {
      return ((scrollTop - start) / Math.max(holdStart - start, 1)) * 0.5;
    }

    return 0.5 + ((scrollTop - holdEnd) / Math.max(end - holdEnd, 1)) * 0.5;
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    }

    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller?.scrollTop || 0,
      containerHeight: scroller?.clientHeight || window.innerHeight,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        let offset = 0;
        let current = element;

        while (current) {
          offset += current.offsetTop || 0;
          current = current.offsetParent;
        }

        return offset;
      }
      return element.offsetTop;
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const cardHeight = card.offsetHeight || card.getBoundingClientRect().height || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = holdProgress(scrollTop, triggerStart, triggerEnd, 160);
      const turnProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
      const pageTurn = pageTurnAmount ? Math.sin(turnProgress * Math.PI) * pageTurnAmount : 0;
      const visualCenteredOffset = useWindowScroll ? (cardHeight * scale) / 2 : 0;
      const pinStart = cardTop - stackPositionPx + visualCenteredOffset - itemStackDistance * i;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j += 1) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx - visualCenteredOffset + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx - visualCenteredOffset + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        pageTurn: Math.round(pageTurn * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.pageTurn - newTransform.pageTurn) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg) rotateY(${newTransform.pageTurn}deg)`;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    pageTurnAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => updateCardTransforms(), [updateCardTransforms]);

  const getInitialScrollTarget = useCallback(
    (cards) => {
      if (initialCardIndex === null || initialCardIndex === undefined) return 0;

      const card = cards[initialCardIndex];
      if (!card) return 0;

      const { containerHeight } = getScrollData();
      const stackPositionPx = parsePercentage(stackPosition, containerHeight);
      const cardTop = getElementOffset(card);
      const measuredHeight = card.offsetHeight || card.getBoundingClientRect().height || 0;
      const image = card.querySelector('img');
      const imageWidth = image?.clientWidth || card.clientWidth || 0;
      const estimatedImageHeight = image?.naturalWidth && image?.naturalHeight && imageWidth
        ? (image.naturalHeight / image.naturalWidth) * imageWidth
        : 0;
      const cardHeight = measuredHeight || estimatedImageHeight;

      if (!cardHeight) return 0;

      return Math.max(0, cardTop + cardHeight / 2 - stackPositionPx);
    },
    [getElementOffset, getScrollData, initialCardIndex, parsePercentage, stackPosition],
  );

  const scrollToStartPosition = useCallback(
    (lenis, cards) => {
      const target = getInitialScrollTarget(cards);
      const initialCard = initialCardIndex === null || initialCardIndex === undefined
        ? null
        : cards[initialCardIndex];
      const initialCardHeight = initialCard
        ? initialCard.offsetHeight || initialCard.getBoundingClientRect().height || 0
        : 1;

      if (useWindowScroll) {
        window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = target;
        document.body.scrollTop = target;
      } else if (scrollerRef.current) {
        scrollerRef.current.scrollTop = target;
      }

      lenis?.scrollTo(target, { immediate: true, force: true });
      window.requestAnimationFrame(updateCardTransforms);

      if (!initialPositionedRef.current && initialCardHeight > 0) {
        initialPositionedRef.current = true;
        window.requestAnimationFrame(() => onInitialPositioned?.());
      }
    },
    [getInitialScrollTarget, initialCardIndex, onInitialPositioned, updateCardTransforms, useWindowScroll],
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    stackCompletedRef.current = false;
    lastTransformsRef.current.clear();
    isUpdatingRef.current = false;
    initialPositionedRef.current = false;
    initialLockActiveRef.current = Boolean(forceInitialPosition);
    initialTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    initialTimersRef.current = [];

    if (useWindowScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      scroller.scrollTop = 0;
    }

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'center center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.perspective = '1000px';
    });

    const lenis = useWindowScroll
      ? new Lenis({
          duration: 0.72,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
          touchMultiplier: 2.8,
          infinite: false,
          wheelMultiplier: 1.8,
          lerp: 0.18,
          syncTouch: true,
          syncTouchLerp: 0.075,
        })
      : new Lenis({
          wrapper: scroller,
          content: scroller.querySelector('.scroll-stack-inner'),
          duration: 0.72,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
          touchMultiplier: 2.8,
          infinite: false,
          wheelMultiplier: 1.8,
          lerp: 0.18,
        });

    lenis.on('scroll', handleScroll);

    const forceStartPosition = () => scrollToStartPosition(lenis, cards);
    forceStartPosition();

    if (forceInitialPosition) {
      window.requestAnimationFrame(() => {
        forceStartPosition();
        window.requestAnimationFrame(forceStartPosition);
      });

      [80, 180, 360, 720].forEach((delay) => {
        const timer = window.setTimeout(forceStartPosition, delay);
        initialTimersRef.current.push(timer);
      });

      const unlockTimer = window.setTimeout(() => {
        initialLockActiveRef.current = false;
      }, 900);
      initialTimersRef.current.push(unlockTimer);
    }

    const raf = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    updateCardTransforms();

    const scheduleUpdate = () => {
      window.requestAnimationFrame(
        forceInitialPosition && initialLockActiveRef.current ? forceStartPosition : updateCardTransforms,
      );
    };

    const scheduleStartPosition = () => {
      if (!forceInitialPosition || initialLockActiveRef.current) {
        window.requestAnimationFrame(forceStartPosition);
      }
    };

    const images = Array.from(scroller.querySelectorAll('img'));
    images.forEach((image) => {
      if (!image.complete) image.addEventListener('load', scheduleStartPosition, { once: true });
      if (forceInitialPosition && image.decode) {
        image.decode().then(scheduleStartPosition).catch(() => {});
      }
    });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(scroller);
    cards.forEach((card) => resizeObserver.observe(card));

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      initialTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      initialTimersRef.current = [];
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('load', scheduleUpdate);
      images.forEach((image) => image.removeEventListener('load', scheduleStartPosition));
      resizeObserver.disconnect();
      lenisRef.current?.destroy();
      lenisRef.current = null;
      cards.forEach((card, i) => {
        if (i < cards.length - 1) card.style.marginBottom = '';
        card.style.willChange = '';
        card.style.transformOrigin = '';
        card.style.backfaceVisibility = '';
        card.style.transform = '';
        card.style.filter = '';
        card.style.perspective = '';
      });
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
      initialLockActiveRef.current = false;
    };
  }, [itemDistance, useWindowScroll, forceInitialPosition, handleScroll, updateCardTransforms, scrollToStartPosition]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
