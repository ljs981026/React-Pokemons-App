import { useEffect } from "react";

export default function useOnclickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      console.log(event.target)
      // 영역 안쪽 클릭
      if (!ref.current || ref.current.contains(event.target)) {
        console.log('inner')
        return;
      }
      // 영역 바깥쪽 클릭
      handler()
    }
    document.addEventListener('mousedown', listener);
  
    return () => {
      document.removeEventListener('mousedown', listener);
    }
  }, [ref, handler]
  )
}