import { useRef } from 'react';

interface IProps {
  loading: boolean;
  // offset: number;
  // total: number;
  // limit: number;
  onLoad: () => void;
}
export default function AutoLoading(props: IProps) {
  const {
    onLoad,
    loading,
    // offset, limit, total,
  } = props;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topRef = useRef(0);

  const handleRef = (target: HTMLDivElement | null) => {
    if (!target) {
      return;
    }
    if (!observerRef.current) {
      let options = {
        root: target.offsetParent,
        rootMargin: '0px',
        threshold: 1.0,
      };

      let observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        const top = target.offsetTop;
        // const noMore = (offset + 1) * limit >= total;
        if (entry.isIntersecting && !loading && Math.abs(top - topRef.current) > 100 /* && !noMore */) {
          topRef.current = top;
          onLoad();
        }
      }, options);
      observer.observe(target);
    }
  };
  return (
    <div ref={handleRef}>
      {loading && <div className="h-10 leading-10 mt-8 text-center text-gray-400 text-xs">正在加载更多</div>}
    </div>
  );
}
